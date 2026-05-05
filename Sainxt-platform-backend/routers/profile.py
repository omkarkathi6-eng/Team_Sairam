from fastapi import APIRouter, HTTPException, Depends, status, Form, File, UploadFile
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from pymongo import MongoClient
from datetime import datetime, timezone
import jwt
import os
import datetime
from typing import Optional, List, Dict, Any
import logging
from dotenv import load_dotenv
from bson import ObjectId
import io

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# JWT configuration
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
JWT_ALGORITHM = "HS256"

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Assuming MongoDB connection is handled in fastapi_app.py and injected
router = APIRouter()

client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/dummy_db"))
db = client[os.getenv("MONGO_DB_NAME", "data")]
profile_collection = db["profiles"]
profile_details_collection = db["profile_details"]


# Pydantic Models
class ProfileModel(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    location: str
    dob: str
    description: str

class EducationModel(BaseModel):
    university: str
    degree_level: str
    major: str
    graduation_year: str
    cgpa: str
    additional_info: str

class ExperienceModel(BaseModel):
    work_experience: str
    job_title: str
    company: str
    location: str
    start_date: str
    end_date: str
    description: str

class ProjectModel(BaseModel):
    project_title: str
    project_url: str
    start_date: str
    end_date: str
    description: str

class SkillsModel(BaseModel):
    technical_skills: str
    soft_skills: str
    language: str
    proficiency: str

class PreferencesModel(BaseModel):
    job_types: str
    salary_expectations: str
    location_preferences: str
    work_environment: str
    industry_preferences: str
    company_size: str
    career_goals: str

# Dependency to get the database collection
def get_db_collection():
    from fastapi import Request
    from fastapi_app import app
    return app.state.db['profiles']

last_email = None

from fastapi import UploadFile, File, Form
import datetime

@router.post('/save_profile')
async def api_save_profile(
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    location: str = Form(""),
    dob: str = Form(""),
    description: str = Form(""),
    profile_photo: UploadFile = File(None),   # ✅ Accept photo
    collection=Depends(get_db_collection)
):
    global last_email
    last_email = email

    # Base profile data
    profile_data = {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "phone": phone,
        "location": location,
        "dob": dob,
        "description": description,
        "updated_at": datetime.datetime.utcnow()
    }

    # ✅ Save profile photo if provided
    if profile_photo:
        profile_data["profile_photo_name"] = profile_photo.filename
        profile_data["profile_photo_content_type"] = profile_photo.content_type
        profile_data["profile_photo_bytes"] = await profile_photo.read()

    # ---------- Save or update profile ----------
    existing_profile = collection.find_one({'email': email})
    if existing_profile:
        result = collection.update_one(
            {'email': email},
            {'$set': profile_data}
        )
        msg = 'Profile updated successfully' if result.modified_count else 'Profile already up to date'
    else:
        profile_data["created_at"] = datetime.datetime.utcnow()
        collection.insert_one(profile_data)
        msg = 'Profile created successfully'

    # ---------- Sync with profile_details collection ----------
    existing_details = profile_details_collection.find_one({'email': email})
    if existing_details:
        profile_details_collection.update_one(
            {'email': email},
            {'$set': profile_data}
        )
    else:
        profile_details_collection.insert_one(profile_data)

    return JSONResponse(content={'message': msg}, status_code=200 if "updated" in msg else 201)


@router.get("/user/profile-photo/{profile_id}")
async def get_profile_photo(profile_id: str):
    profile = profile_collection.find_one({"_id": ObjectId(profile_id)})
    if not profile or "profile_photo_bytes" not in profile:
        raise HTTPException(status_code=404, detail="Profile photo not found")

    return StreamingResponse(
        io.BytesIO(profile["profile_photo_bytes"]),
        media_type=profile.get("profile_photo_content_type", "image/jpeg")
    )




@router.post('/save_education')
async def api_save_education(education: EducationModel, collection=Depends(get_db_collection)):
    global last_email
    if not last_email:
        raise HTTPException(status_code=400, detail='No profile found. Please submit profile first.')

    collection.update_one(
        {'email': last_email},
        {'$set': education.dict()},
        upsert=True
    )
    return JSONResponse(content={'message': 'Education details saved/updated successfully'}, status_code=200)


@router.post('/save_experience')
async def api_save_experience(exp: ExperienceModel, collection=Depends(get_db_collection)):
    global last_email
    if not last_email:
        raise HTTPException(status_code=400, detail='No profile found. Submit profile first.')

    collection.update_one(
        {'email': last_email},
        {'$set': exp.dict()},
        upsert=True
    )
    return JSONResponse(content={'message': 'Experience saved/updated successfully'}, status_code=200)


@router.post('/save_project')
async def api_save_project(project: ProjectModel, collection=Depends(get_db_collection)):
    global last_email
    if not last_email:
        raise HTTPException(status_code=400, detail='No profile found. Submit profile first.')

    collection.update_one(
        {'email': last_email},
        {'$set': project.dict()},
        upsert=True
    )
    return JSONResponse(content={'message': 'Project saved/updated successfully'}, status_code=200)


@router.post('/save_skills')
async def api_save_skills(skills: SkillsModel, collection=Depends(get_db_collection)):
    global last_email
    if not last_email:
        raise HTTPException(status_code=400, detail='No profile found. Submit profile first.')

    collection.update_one(
        {'email': last_email},
        {'$set': skills.dict()},
        upsert=True
    )
    return JSONResponse(content={'message': 'Skills saved/updated successfully'}, status_code=200)


@router.post('/save_preferences')
async def api_save_preferences(pref: PreferencesModel, collection=Depends(get_db_collection)):
    global last_email
    if not last_email:
        raise HTTPException(status_code=400, detail='No profile found. Submit profile first.')

    collection.update_one(
        {'email': last_email},
        {'$set': pref.dict()},
        upsert=True
    )
    return JSONResponse(content={'message': 'Preferences saved/updated successfully'}, status_code=200)




@router.get("/score")
def get_profile_score(email: str):
    profile = profile_collection.find_one({"email": email})
    if not profile:
        return {"exists": False}

    scores = profile.get("scores", {})
    try:
        profile_score = float(scores.get("profile_score", 0))
        qualification_score = float(scores.get("qualification_score", 0))
        skill_score = float(scores.get("skill_score", 0))
        soft_skills_score = float(scores.get("soft_skills_score", 0))
    except ValueError:
        raise HTTPException(status_code=500, detail="Invalid score data")

    avg_percent = (
        (profile_score / 5) +
        (qualification_score / 5) +
        (skill_score / 5) +
        (soft_skills_score / 5)
    ) * 25

    return {
        "exists": True,
        "percentage": round(avg_percent, 1)
    }

# @router.get("/profile")
# def get_profile_by_email(email: str):
#     profile = profile_collection.find_one({"email": email})
#     if not profile:
#         raise HTTPException(status_code=404, detail="Profile not found")
    
#     profile["_id"] = str(profile["_id"])
#     if "user_id" in profile:
#         profile["user_id"] = str(profile["user_id"])
        
#     return profile

@router.get("/profile")
def get_profile_by_email(email: str):
    try:
        # Find profile by email
        profile = profile_collection.find_one({"email": email})
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")

        # Convert ObjectIds to strings
        if "_id" in profile:
            profile["_id"] = str(profile["_id"])
        if "user_id" in profile and isinstance(profile["user_id"], ObjectId):
            profile["user_id"] = str(profile["user_id"])

        # 🚨 Remove binary data from response
        if "profile_photo_bytes" in profile:
            profile.pop("profile_photo_bytes")

        # ✅ Optionally provide a profile photo URL instead of sending bytes
        if profile.get("profile_photo_name"):
            profile["profile_photo_url"] = (
                f"http://localhost:5000/api/user/profile-photo/{profile['_id']}"
            )

        return profile

    except Exception as e:
        print(f"Error fetching profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/save_draft")
async def save_draft(
    token: str = Depends(oauth2_scheme),
    first_name: str = Form(""),
    last_name: str = Form(""),
    email: str = Form(""),
    phone: str = Form(""),
    location: str = Form(""),
    date_of_birth: str = Form(""),
    bio: str = Form(""),
    university: str = Form(""),
    degree: str = Form(""),
    major: str = Form(""),
    graduation_year: str = Form(""),
    gpa: str = Form(""),
    additional_education: str = Form("[]"),
    work_experiences: str = Form("[]"),
    projects: str = Form("[]"),
    technical_skills: str = Form("[]"),
    soft_skills: str = Form("[]"),
    languages: str = Form("[]"),
    job_types: str = Form("[]"),
    salary_expectation: str = Form(""),
    willing_to_relocate: str = Form("false"),
    preferred_locations: str = Form("[]"),
    preferred_industries: str = Form("[]"),
    preferred_company_size: str = Form("[]"),
    work_environment: str = Form(""),
    career_goals: str = Form(""),
    currentStep: str = Form("1"),
    profile_photo: UploadFile = File(None),
    collection=Depends(get_db_collection)
):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_email = payload.get("email")
        if not user_email:
            raise HTTPException(status_code=400, detail="Invalid token")

        # Parse JSON strings into Python objects
        import json
        def parse_json(value, default):
            try:
                return json.loads(value)
            except:
                return default

        draft_data = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email or user_email,
            "phone": phone,
            "location": location,
            "date_of_birth": date_of_birth,
            "bio": bio,
            "university": university,
            "degree": degree,
            "major": major,
            "graduation_year": graduation_year,
            "gpa": gpa,
            "additional_education": parse_json(additional_education, []),
            "work_experiences": parse_json(work_experiences, []),
            "projects": parse_json(projects, []),
            "technical_skills": parse_json(technical_skills, []),
            "soft_skills": parse_json(soft_skills, []),
            "languages": parse_json(languages, []),
            "job_types": parse_json(job_types, []),
            "salary_expectation": salary_expectation,
            "willing_to_relocate": willing_to_relocate.lower() == "true",
            "preferred_locations": parse_json(preferred_locations, []),
            "preferred_industries": parse_json(preferred_industries, []),
            "preferred_company_size": parse_json(preferred_company_size, []),
            "work_environment": work_environment,
            "career_goals": career_goals,
            "isDraft": True,
            "lastSaved": datetime.datetime.utcnow(),
            "currentStep": int(currentStep),
        }

        # Handle photo (optional)
        if profile_photo:
            draft_data["profile_photo_name"] = profile_photo.filename
            draft_data["profile_photo_content_type"] = profile_photo.content_type
            draft_data["profile_photo_bytes"] = await profile_photo.read()

        collection.update_one(
            {"email": user_email},
            {"$set": draft_data},
            upsert=True
        )
        return {"message": "Draft saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
    
@router.get("/user/draft")
async def get_draft(
    token: str = Depends(oauth2_scheme),
    collection=Depends(get_db_collection)
):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_email = payload.get("email")
        if not user_email:
            raise HTTPException(status_code=400, detail="Invalid token")

        draft = collection.find_one({"email": user_email, "isDraft": True})
        if draft:
            # ✅ Remove raw photo bytes for safety
            if "profile_photo_bytes" in draft:
                draft.pop("profile_photo_bytes")

            # ✅ Add profile photo URL if photo exists
            if draft.get("profile_photo_name"):
                draft["profile_photo_url"] = (
                    f"http://localhost:5000/api/user/profile-photo/{draft['_id']}"
                )

            # ✅ Convert ObjectId → str automatically
            return jsonable_encoder(draft, custom_encoder={ObjectId: str})

        return {}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))





@router.get('/user/profile')
async def get_user_profile(token: str = Depends(oauth2_scheme), collection=Depends(get_db_collection)):
    from bson import ObjectId

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_email = payload.get('email')
        user_id = payload.get('id')

        if not user_email or not user_id:
            raise HTTPException(status_code=400, detail='Incomplete user data in token')

        # --- Fetch all profiles with this email ---
        profiles = list(collection.find({"email": user_email}))

        user_profile = None
        if profiles:
            # Prefer the one with recommendations/skill_pathway
            for p in profiles:
                if "recommendations" in p or "skill_pathway" in p:
                    user_profile = p
                    break
            # Fallback: just take the first one
            if not user_profile:
                user_profile = profiles[0]

        # If still no profile, create a new one
        if not user_profile:
            profile_data = {
                "user_id": ObjectId(user_id),
                "email": user_email,
                "first_name": "",
                "last_name": "",
                "created_at": datetime.datetime.utcnow(),
                "updated_at": datetime.datetime.utcnow(),
                "recommendations": [],
                "skill_pathway": [],
                "evaluation": {},
                "gap_analysis": {},
                "market_fitment": {},
                "scores": {}
            }
            result = collection.insert_one(profile_data)
            user_profile = collection.find_one({"_id": result.inserted_id})

        # ✅ Convert ObjectIds to strings
        if '_id' in user_profile:
            user_profile['_id'] = str(user_profile['_id'])
        if 'user_id' in user_profile and isinstance(user_profile['user_id'], ObjectId):
            user_profile['user_id'] = str(user_profile['user_id'])

        # ✅ Remove raw image bytes if present (to avoid UnicodeDecodeError)
        if "profile_photo_bytes" in user_profile:
            user_profile.pop("profile_photo_bytes")

        if user_profile.get("profile_photo_name"):
            user_profile["profile_photo_url"] = (
            f"http://localhost:5000/api/user/profile-photo/{user_profile['_id']}"
        )



        # ✅ If a profile photo exists, add a URL for frontend
        if user_profile.get("profile_photo_name"):
            user_profile["profile_photo_url"] = f"http://localhost:5000/api/user/profile-photo/{user_profile['_id']}"

        return user_profile

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Token has expired')
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail='Invalid token')
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail='Internal server error')
    


@router.get("/user/evaluation-report")
async def get_evaluation_report(email: str):
    evaluation_report_collection = db["evaluation_report"]
    report = evaluation_report_collection.find_one({"email": email})
    if not report:
        return {"exists": False}

    # Convert ObjectId → str
    report["_id"] = str(report["_id"])
    if "user_id" in report and isinstance(report["user_id"], ObjectId):
        report["user_id"] = str(report["user_id"])

    # Keep both: raw skill_breakdown + summarized analysis
    if "detailed_analysis" in report:
        detailed = report["detailed_analysis"]

        # If skill_summary doesn’t exist, add it
        if "skill_summary" not in report:
            report["skill_summary"] = {}

        # merge per-skill summaries
        if "skill_breakdown" in detailed:
            report["skill_summary"].update(detailed["skill_breakdown"])

        # also attach overall assessment, strengths, weaknesses, etc.
        report["overall_assessment"] = detailed.get("overall_assessment", {})
        report["strengths"] = detailed.get("strengths", [])
        report["weaknesses"] = detailed.get("weaknesses", [])
        report["recommendations"] = detailed.get("recommendations", [])
        report["learning_path"] = detailed.get("learning_path", [])
        report["immediate_actions"] = detailed.get("immediate_actions", [])
        report["long_term_goals"] = detailed.get("long_term_goals", [])

        # drop old detailed_analysis to avoid confusion
        del report["detailed_analysis"]

    return {"evaluation": report}

@router.get("/actual-evaluation")
async def get_actual_evaluation(
    token: str = Depends(oauth2_scheme),
    collection=Depends(get_db_collection)
):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_email = payload.get("email")
        if not user_email:
            raise HTTPException(status_code=400, detail="Invalid token: missing email")

        # Collections
        profile_coll = db["profiles"]
        evaluation_coll = db["evaluation_report"]
        actual_coll = db["actual_evaluation"]

        # Fetch profile
        profile = profile_coll.find_one({"email": user_email})
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")

        # Fetch latest evaluation report
        report = evaluation_coll.find_one(
            {"email": user_email},
            sort=[("created_at", -1)]
        )
        if not report:
            raise HTTPException(status_code=404, detail="Evaluation report not found")

        # DEBUG: Print the entire report structure
        print("=== FULL REPORT DEBUG ===")
        print(f"Report keys: {list(report.keys())}")
        print(f"Report type: {type(report)}")
        
        # Check if these fields exist at the top level
        print(f"\nTop-level field checks:")
        print(f"'learning_path' in report: {'learning_path' in report}")
        print(f"'immediate_actions' in report: {'immediate_actions' in report}")
        print(f"'long_term_goals' in report: {'long_term_goals' in report}")
        
        # Print the actual values
        print(f"\nActual values:")
        print(f"learning_path: {report.get('learning_path')}")
        print(f"immediate_actions: {report.get('immediate_actions')}")
        print(f"long_term_goals: {report.get('long_term_goals')}")
        
        # Check if they're nested in detailed_analysis
        detailed_analysis = report.get("detailed_analysis", {})
        print(f"\nDetailed analysis keys: {list(detailed_analysis.keys()) if detailed_analysis else 'None'}")
        print(f"detailed_analysis learning_path: {detailed_analysis.get('learning_path') if detailed_analysis else 'N/A'}")
        print(f"detailed_analysis immediate_actions: {detailed_analysis.get('immediate_actions') if detailed_analysis else 'N/A'}")
        print(f"detailed_analysis long_term_goals: {detailed_analysis.get('long_term_goals') if detailed_analysis else 'N/A'}")
        
        print("=== END DEBUG ===")

        existing_actual = actual_coll.find_one({"email": user_email}) or {}

        # Step 1: Base scores from profile
        base_scores = profile.get("scores", {})
        qualification_score = base_scores.get("qualification_score", 0)
        soft_skills_score = base_scores.get("soft_skills_score", 0)

        # Step 2: Recalculate skill_score from evaluation_report.skill_breakdown
        skill_breakdown = report.get("skill_breakdown", {})
        actual_scores = [v.get("score", 0) for v in skill_breakdown.values()]

        # Normalize scores from 100 → 5.0
        normalized_scores = [(s / 100) * 5 for s in actual_scores if s is not None]

        new_skill_score = (
            sum(normalized_scores) / len(normalized_scores)
            if normalized_scores
            else base_scores.get("skill_score", 0)
        )

        # Step 3: Recalculate profile_score (average of all scores)
        all_scores = [
            qualification_score,
            soft_skills_score,
            new_skill_score,
        ]
        profile_score = (
            sum(all_scores) / len(all_scores)
            if all_scores else base_scores.get("profile_score", 0)
        )

        updated_scores = {
            "qualification_score": qualification_score,
            "soft_skills_score": soft_skills_score,
            "skill_score": round(new_skill_score, 2),
            "profile_score": round(profile_score, 2),
        }

        # Step 4: Merge insights from evaluation_report
        actual_detailed = report.get("detailed_analysis", {})
        updated_gap = {
            "strengths": report.get("strengths") or actual_detailed.get("strengths", []),
            "weaknesses": report.get("weaknesses") or actual_detailed.get("weaknesses", []),
        }

        # Try multiple sources for the missing fields
        def get_field_from_multiple_sources(field_name):
            # First try top level
            value = report.get(field_name)
            if value:
                return value
            
            # Then try detailed_analysis
            if actual_detailed:
                value = actual_detailed.get(field_name)
                if value:
                    return value
            
            # For learning_path, also try existing actual_evaluation as fallback
            if field_name == "learning_path":
                return existing_actual.get("learning_path", [])
            
            return []

        updated = {
            "email": user_email,
            "scores": updated_scores,
            "gap_analysis": updated_gap,
            "recommendations": report.get("recommendations") or [],
            "learning_path": get_field_from_multiple_sources("learning_path"),
            "immediate_actions": get_field_from_multiple_sources("immediate_actions"),
            "long_term_goals": get_field_from_multiple_sources("long_term_goals"),
            "updated_at": datetime.datetime.utcnow(),
        }

        # DEBUG: Print what we're about to save
        print("=== SAVING DEBUG ===")
        print(f"learning_path to save: {updated['learning_path']}")
        print(f"immediate_actions to save: {updated['immediate_actions']}")
        print(f"long_term_goals to save: {updated['long_term_goals']}")
        print("=== END SAVING DEBUG ===")

        # Step 5: Upsert into actual_evaluation (preserve created_at on insert)
        result = actual_coll.update_one(
            {"email": user_email},
            {
                "$set": updated,
                "$setOnInsert": {"created_at": datetime.datetime.utcnow()}
            },
            upsert=True
        )
        
        print(f"Update result: matched={result.matched_count}, modified={result.modified_count}")

        # Fetch updated doc
        final_doc = actual_coll.find_one({"email": user_email})
        final_doc["_id"] = str(final_doc["_id"])

        return jsonable_encoder(final_doc)

    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error")








