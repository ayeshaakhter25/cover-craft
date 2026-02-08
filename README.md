# cover-craft
CoverCraft is an AI-based web app that generates professional, job-specific cover letters using a user’s resume and job description. It analyzes skills, experience, and requirements to create personalized letters. This Final Year Project showcases practical use of AI and web technologies to automate the job application process.

## Project structure

- frontend/ — Frontend application (UI). Place web app code here.
- backend/ — Backend API and server code. Place server, routes, DB code here.

## Quick start (local)

Frontend
- cd frontend
- npm install
- npm run dev    # or `npm start` depending on your setup

Backend
- cd backend
- npm install
- python -m uvicorn main:app --reload    # or `npm start` depending on your setup

Run both
- Open two terminals and run the frontend and backend commands above.
- Or add a root-level script (e.g., using `concurrently`) to start both.

## Environment

- Create `.env` files in frontend/ and backend/ as needed.
- Example backend/.env:
  - PORT=5000
  - DATABASE_URL=your-db-connection-string
  - JWT_SECRET=your-secret
- Example frontend/.env:
  - REACT_APP_API_URL=http://localhost:5000

## Build and deploy

- Frontend: `cd frontend && npm run dev`
- Backend: build/start per your server framework (e.g., `npm run start`)

## Implemented skeletons

Basic skeletons were added under frontend/ (Vite + React) and backend/ (FastAPI). Use the commands below to run each locally.

Frontend
- cd frontend
- npm install
- npm run dev

Backend
- cd backend
- python -m venv .venv
- .venv\Scripts\activate  # on Windows, or `source .venv/bin/activate` on macOS/Linux
- pip install -r requirements.txt
- copy .env.example to .env and edit if needed
- python -m uvicorn main:app --reload --port 5000

Run both
- Start backend, then frontend (frontend expects VITE_API_URL configured or default http://localhost:5000)

## Quick connectivity checks

1. Start backend (example):
   - cd backend
   - python -m uvicorn main:app --reload --host 0.0.0.0 --port 5000

2. Test from terminal:
   - curl http://localhost:5000/health
   - curl -i http://localhost:5000/debug-origin

3. From browser:
   - Start frontend (cd frontend && npm run dev)
   - Use the "Test Connection" button in the app to call /debug-origin and see the Origin reported.

4. If you still see "Failed to fetch":
   - Verify the backend process is running and listening on the port you expect.
   - Ensure VITE_API_URL in frontend/.env points to http://localhost:5000 and restart Vite.
   - Check browser console for CORS errors and backend logs (Origin printed by the new middleware).
   - Make sure FRONTEND_ORIGIN in backend/.env includes your dev origin (e.g., http://localhost:5173).

## Troubleshooting: "Error: Failed to fetch"

- Ensure backend is running:
  - cd backend
  - python -m uvicorn main:app --reload --port 5000
  - Test: curl http://localhost:5000/health  (should return {"status":"ok"})

- Ensure frontend points to backend:
  - In frontend/.env (or .env.local) set VITE_API_URL=http://localhost:5000
  - Restart Vite after changing env vars: npm run dev

- CORS:
  - Backend reads FRONTEND_ORIGIN (comma-separated allowed origins). Example:
    FRONTEND_ORIGIN=http://localhost:5173
  - If you use wildcard (*) set FRONTEND_ORIGIN=* but note credentials are disabled in that mode.

- Common causes of "Failed to fetch":
  - Backend not running or wrong port
  - Frontend using wrong API URL
  - CORS/preflight blocked (see logs)
  - Network/HTTPS mismatch (http vs https)
