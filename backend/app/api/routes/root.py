from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def root():
    return {
        "application": "LeadHunter Enterprise",
        "version": "0.1.0",
        "status": "running"
    }