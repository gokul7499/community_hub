# Community Help Hub - Backend API

Express.js backend to support the Community Help Hub Flutter app. Uses JWT auth and an in-memory datastore so it runs without installing a database.

## Quick Start

1. Install Node.js 18+
2. In this `backend/` folder, install deps:
```bash
npm install
```
3. Create `.env` (optional):
```
PORT=5000
JWT_SECRET=super_secret_change_me
NODE_ENV=development
```
4. Run in dev mode:
```bash
npm run dev
```
Or start:
```bash
npm start
```

The API will be available at http://localhost:5000

## Endpoints (match frontend constants)

- Auth (`/api/auth`)
  - POST `/register` { name, email, password, phone, location }
  - POST `/login` { email, password }
  - GET `/profile` (Bearer token)

- Posts (`/api/posts`)
  - GET `/` query: category, status, page, limit
  - POST `/` (Bearer) { title, description, category, location, urgency, images?, tags? }

- Users (`/api/users`)
  - GET `/` list users
  - GET `/:id` user details

- Events (`/api/events`)
  - GET `/` list
  - POST `/` (Bearer) create
  - POST `/:id/join` (Bearer)

- Emergency (`/api/emergency`)
  - GET `/` list alerts
  - POST `/` (Bearer) create alert
  - POST `/:id/respond` (Bearer)

- Achievements (`/api/achievements`)
  - GET `/` list
  - GET `/stats` (Bearer) user stats

- Chat (`/api/chat`)
  - GET `/rooms` (Bearer) my rooms
  - POST `/rooms` (Bearer) { participantIds: [] }
  - GET `/rooms/:id/messages` (Bearer)
  - POST `/rooms/:id/messages` (Bearer) { content, type?, metadata? }

## Notes
- Data is stored in-memory; it resets on restart.
- Replace with a proper database later if needed.
- CORS is enabled for local dev.
