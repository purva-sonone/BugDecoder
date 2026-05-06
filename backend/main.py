from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.debug import router as debug_router
from app.api.auth import router as auth_router
from app.core.db import init_db
import uvicorn
import os

app = FastAPI(title="Bug Decoder API", version="1.0.0")

@app.on_event("startup")
async def startup_event():
    try:
        print("[DB] Connecting to MongoDB Atlas...")
        await init_db()
        print("[DB] MongoDB Connected Successfully!")
    except Exception as e:
        print(f"[DB] MongoDB Connection Failed: {str(e)}")
        # Don't raise here so the server can still start and show status

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(debug_router, prefix="/api/debug", tags=["Debug"])

@app.get("/")
async def root():
    return {"message": "Welcome to Bug Decoder API", "status": "online"}

@app.get("/health")
async def health_check():
    from app.models.user import User
    db_status = "Connected"
    try:
        # Try a simple query to check DB
        await User.find_one()
    except Exception as e:
        db_status = f"Disconnected: {str(e)}"
    
    return {
        "status": "healthy",
        "database": db_status,
        "environment": "production" if os.getenv("VERCEL") else "development"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
