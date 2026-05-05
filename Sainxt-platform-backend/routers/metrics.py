from fastapi import APIRouter, Depends
from pymongo.database import Database
from pymongo import MongoClient
from database import get_db  
import os
 
router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])
 
client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/dummy_db"))
db_name = os.getenv("MONGO_DB_NAME", "data")
db = client[db_name]
users_collection = db["users"]
progress_collection = db["training_progress"]
 
@router.get("/metrics")
async def get_platform_metrics(db: Database = Depends(get_db)):
 
    # Count total users (individual and admin)
    total_users = users_collection.count_documents({"userType": {"$in": ["individual", "admin"]}})
 
    # Count active assessments = number of documents in training_progress
    active_assessments = progress_collection.count_documents({})
 
    return {
        "total_users": total_users,
        "active_assessments": active_assessments
    }
 