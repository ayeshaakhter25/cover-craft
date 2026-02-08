from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import logging

load_dotenv()

app = FastAPI(title="cover-craft backend")

# CORS (fixed)
frontend_origins = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
if frontend_origins.strip() == "*":
    origins = ["*"]
    allow_credentials = False  # cannot allow credentials with wildcard origin
else:
    origins = [o.strip() for o in frontend_origins.split(",") if o.strip()]
    if not origins:
        origins = ["http://localhost:5173"]
    allow_credentials = True

logging.basicConfig(level=logging.INFO)
logging.info(f"Allowed CORS origins: {origins}  allow_credentials={allow_credentials}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logging.info("Incoming request: %s %s Origin=%s", request.method, request.url.path, request.headers.get("origin"))
    response = await call_next(request)
    return response

# debug endpoint to check CORS/origin reception from browser
@app.get("/debug-origin")
def debug_origin(request: Request):
    return {"origin_received": request.headers.get("origin")}

class GenerateRequest(BaseModel):
    resume: str
    job: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
def index():
    return {"message": "cover-craft backend running. Use /health and POST /generate"}

@app.post("/generate")
def generate(req: GenerateRequest):
    logging.info("Received /generate request (resume_length=%d, job_length=%d)", len(req.resume or ""), len(req.job or ""))
    if not req.resume.strip() or not req.job.strip():
        raise HTTPException(status_code=400, detail="resume and job are required")
    # Placeholder generation logic — replace with your AI integration
    cover = (
        "Dear Hiring Manager,\n\n"
        "I am writing to express my interest in the position. Based on my experience and skills:\n\n"
        f"Resume summary:\n{req.resume[:800]}...\n\n"
        f"Job description summary:\n{req.job[:800]}...\n\n"
        "I believe my background makes me a strong fit for this role.\n\nSincerely,\n[Your Name]"
    )
    return {"cover_letter": cover}
