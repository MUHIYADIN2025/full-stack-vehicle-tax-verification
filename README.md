# VEHICLE Tax Verification System

This repository contains a full-stack vehicle tax verification application with:
- `backend/` — Node.js + Express API using MongoDB
- `FORANEND/` — Next.js frontend built with React, Tailwind CSS and TypeScript

## Repository Structure

- `backend/`
  - `index.js` — Express server entry
  - `config/` — configuration loader
  - `controllers/` — request handling logic
  - `routes/` — API routes
  - `models/` — Mongoose data models
  - `middleware/` — auth middleware
  - `utils/` — helper utilities and seed data

- `FORANEND/`
  - `app/` — Next.js app routes and pages
  - `components/` — UI components and layouts
  - `lib/` — client utilities and helper functions
  - `styles/` — global styles
  - `public/` — static assets

## Quick Start

### Backend

1. Open a terminal in `backend/`
2. Install dependencies:
```bash
cd backend
npm install
```
3. Create environment variables from `.env.example` if available:
```bash
cp .env.example .env
```
4. Start the backend server:
```bash
npm run dev
```

By default, the backend runs with Node on the configured port and connects to MongoDB using the connection details in `backend/config/index.js`.

### Frontend

1. Open a terminal in `FORANEND/`
2. Install dependencies using pnpm (recommended):
```bash
cd FORANEND
pnpm install
```
3. Start the development frontend:
```bash
pnpm dev
```

The frontend runs as a Next.js application and should connect to the backend API endpoints configured in the app.

## Available Scripts

### Backend
- `npm run dev` — start backend in watch mode
- `npm start` — run backend once
- `npm run seed` — seed demo data

### Frontend
- `pnpm dev` — run Next.js development server
- `pnpm build` — build production frontend
- `pnpm start` — start production build
- `pnpm lint` — run ESLint

## Notes

- The backend uses JWT authentication and requires valid bearer tokens for protected routes.
- The frontend is built with Next.js v16 and React 19.
- MongoDB must be running locally or remotely for the backend to connect successfully.
- If you want to launch both projects at once, start the backend first, then the frontend.

## Additional Documentation

The backend includes a more detailed API-specific README at `backend/README.md`.

## Contact

For questions, review the server route files in `backend/routes/` and the UI pages in `FORANEND/app/`.
