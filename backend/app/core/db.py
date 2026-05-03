from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.user import User, ScanHistory

async def init_db():
    try:
        client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            tlsAllowInvalidCertificates=True
        )
        
        # Ping the server
        await client.admin.command('ping')
        print("[DB] MongoDB Ping Successful!")
        
        # Initialize Beanie
        await init_beanie(
            database=client[settings.DATABASE_NAME],
            document_models=[
                User,
                ScanHistory
            ]
        )
        print(f"[DB] Beanie Initialized with database: {settings.DATABASE_NAME}")
        
    except Exception as e:
        print(f"[DB] DB INIT ERROR: {str(e)}")
        raise e
