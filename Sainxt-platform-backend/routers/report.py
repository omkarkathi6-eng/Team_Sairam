from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from bson.objectid import ObjectId
from openai import OpenAI
import os
import logging
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Create router
router = APIRouter(prefix="/api/report", tags=["reports"])

# Logging config
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# MongoDB connection
mongo_client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/dummy_db"))
db = mongo_client.interview_db
interview_responses_collection = db.interview_responses

# Model settings
GPT_MODEL = "gpt-4o"

# -------------------- Pydantic Models --------------------

class ResponseItem(BaseModel):
    question: str
    answer: str

class AIReviewInput(BaseModel):
    job_description: str
    responses: list[ResponseItem]

# -------------------- Routes --------------------

@router.get("/emails")
def get_emails():
    users_data = interview_responses_collection.find({}, {'candidate_email': 1, 'job_description': 1, '_id': 0})
    unique_users = {}

    for user in users_data:
        email = user.get('candidate_email')
        if email and email not in unique_users:
            unique_users[email] = {
                'email': email,
                'job_description': user.get('job_description', 'No job description provided')
            }

    return list(unique_users.values())


@router.get("/responses/{email}")
def get_user_responses(email: EmailStr):
    user_data = interview_responses_collection.find_one({'candidate_email': email})
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    formatted_responses = [
        {
            'question': res.get('question', ''),
            'answer': res.get('answer', '') or 'No answer provided'
        } for res in user_data.get('responses', [])
    ]

    job_description = user_data.get('job_description', 'No job description available for this user.')

    return {
        'responses': formatted_responses,
        'job_description': job_description
    }


@router.post("/ai_review")
def ai_review(data: AIReviewInput):
    job_description = data.job_description
    interview_responses = data.responses

    if not job_description or not interview_responses:
        raise HTTPException(status_code=400, detail="Missing job description or interview responses")

    # Count missing or weak answers
    missing_answer_count = sum(
        1 for r in interview_responses
        if r.answer.strip().lower() == 'no answer provided' or len(r.answer.strip().split()) < 3
    )

    # Construct the prompt
    prompt_content = f"""You are an expert HR interviewer AI. Your task is to critically review a candidate's interview responses against a given job description.

The candidate left **{missing_answer_count} questions unanswered or provided extremely weak answers.** This should significantly negatively impact the score and fit assessment.

Job Description:\n{job_description}\n\n"""

    prompt_content += "Candidate's Interview Responses:\n"
    for i, res in enumerate(interview_responses):
        prompt_content += f"Question {i + 1}: {res.question}\n"
        prompt_content += f"Answer: {res.answer}\n\n"

    prompt_content += """Based on the above, provide the following:
1.  **Overall Score (out of 100):**
2.  **Fit Assessment:** (e.g., "Excellent Fit", "Good Fit", "Moderate Fit", "Low Fit", "Poor Fit", "Unacceptable Fit").
3.  **Overall Report:** A detailed report.

Format:
Overall Score: [SCORE]/100
Fit Assessment: [TEXT]
Overall Report: [TEXT]
"""

    try:
        # Call OpenAI API
        response = openai_client.chat.completions.create(
            model=GPT_MODEL,
            messages=[
                {"role": "system", "content": "You are an expert HR interviewer AI. Your task is to critically review a candidate's interview responses against a given job description and provide a detailed assessment."},
                {"role": "user", "content": prompt_content}
            ],
            temperature=0.15,
            top_p=0.4,
            max_tokens=1000
        )
        
        ai_raw_text = response.choices[0].message.content

        # Parse response
        score_match = re.search(r"Overall Score:\s*(\d+)/100", ai_raw_text)
        fit_match = re.search(r"Fit Assessment:\s*(.+?)(?=\nOverall Report:|$)", ai_raw_text, re.DOTALL)
        report_match = re.search(r"Overall Report:\s*(.*)", ai_raw_text, re.DOTALL)

        return {
            "overall_score": score_match.group(1) if score_match else "N/A",
            "fit_assessment": fit_match.group(1).strip() if fit_match else "Not found",
            "overall_report": report_match.group(1).strip() if report_match else ai_raw_text
        }

    except Exception as e:
        logging.error(f"AI review error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing your request: {str(e)}")
