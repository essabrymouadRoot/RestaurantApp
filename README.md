# Fun Club

A polished billiards, dining, and reservation application for Fun Club in Agdal, Rabat. For this first UI-focused version, reservations are kept in memory and reset when the application restarts.

## Stack

- React, Vite, and TypeScript
- Express API with Zod validation
- Lightweight in-memory reservation storage for the demo
- One production Docker image containing the compiled frontend and Node API

## Run locally

Use Node.js 22+.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The development API runs at `http://localhost:3000`.

## Run with Docker

```bash
docker compose up --build
```

Open `http://localhost:8080`.

The root `Dockerfile` builds the frontend and API into one image. Push this single image to one ECR repository and run it as one ECS Fargate service on container port `3000`.

Database persistence and reservation emails are intentionally deferred. The API boundary is already in place, so those services can be added later without redesigning the customer interface.

The sample venue name and menu are fictional and intended for the lab.
