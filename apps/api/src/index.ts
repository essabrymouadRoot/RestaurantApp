import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { createReservation, getAvailability } from './repository.js';

const app = express();
const port = Number(process.env.PORT ?? 3000);
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const clientDirectory = path.resolve(currentDirectory, '../../client/dist');

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'upgrade-insecure-requests': null
      }
    }
  })
);
app.use(cors({ origin: process.env.NODE_ENV === 'production' ? false : true }));
app.use(express.json({ limit: '32kb' }));

const reservationSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  guests: z.number().int().min(1).max(6),
  mealId: z.enum(['burger', 'chicken', 'platter']),
  customer: z.object({ name: z.string().trim().min(2).max(80), email: z.string().email().max(254) })
});

app.get('/api/health', (_request, response) => response.json({ status: 'ok', storage: 'memory' }));
app.get('/api/availability', async (request, response) => {
  const parsed = z.object({ date: z.string(), guests: z.coerce.number().min(1).max(6) }).safeParse(request.query);
  if (!parsed.success) return response.status(400).json({ message: 'Invalid query.' });
  return response.json({ times: await getAvailability(parsed.data.date) });
});
app.post('/api/reservations', async (request, response) => {
  const parsed = reservationSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Please check your reservation details.' });
  try {
    const reservation = await createReservation(parsed.data);
    return response.status(201).json(reservation);
  } catch (error) {
    if (error instanceof Error && error.message === 'SLOT_TAKEN') return response.status(409).json({ message: 'This time is no longer available.' });
    console.error(error); return response.status(500).json({ message: 'Unable to create reservation.' });
  }
});

app.use(express.static(clientDirectory));
app.use((request, response, next) => {
  if (request.method === 'GET' && !request.path.startsWith('/api/')) {
    return response.sendFile(path.join(clientDirectory, 'index.html'));
  }
  return next();
});

app.listen(port, '0.0.0.0', () => console.log(`Fun Club application listening on ${port}`));
