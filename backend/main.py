from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class CoverLetterRequest(BaseModel):
    resume: str
    job_description: str

@app.post("/generate")
def generate_cover_letter(data: CoverLetterRequest):
    return {
        "cover_letter": f"This is a demo cover letter for the job.\n\nResume: {data.resume[:100]}..."
    }
