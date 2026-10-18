# Ember & Vine

A polished restaurant reservation application. Customers can choose a date, time, party size, and meal before confirming a booking. For this first UI-focused version, reservations are kept in memory and reset when the API restarts.

## Stack

- React, Vite, and TypeScript
- Express API with Zod validation
- Lightweight in-memory reservation storage for the demo
- Docker Compose with separate Nginx and Node containers

## Run locally

Use Node.js 22+.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:3001`.

## Run with Docker

```bash
docker compose up --build
```

Open `http://localhost:8080`.

Database persistence and reservation emails are intentionally deferred. The API boundary is already in place, so those services can be added later without redesigning the customer interface.

The sample venue name and menu are fictional and intended for the lab.
