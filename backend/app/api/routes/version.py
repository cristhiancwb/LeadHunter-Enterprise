from fastapi import APIRouter

router = APIRouter(tags=["System"])

@router.get("/version")
async def version():
    return {
        "version": "0.1.0"
    }