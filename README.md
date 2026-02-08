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
