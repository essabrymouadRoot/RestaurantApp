import { randomUUID } from 'node:crypto';

type ReservationInput = { date: string; time: string; guests: number; mealId: string; customer: { name: string; email: string } };
const times = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];
const memory = new Map<string, ReservationInput>();
export async function createReservation(input: ReservationInput) {
  const slot = `${input.date}#${input.time}`;
  const id = randomUUID();
  const reference = `EV-${id.slice(0, 6).toUpperCase()}`;
  if (memory.has(slot)) throw new Error('SLOT_TAKEN');
  memory.set(slot, input);
  return { id, reference };
}

export async function getAvailability(date: string) {
  return times.filter(time => !memory.has(`${date}#${time}`));
}
