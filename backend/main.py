from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, query, report
from database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Legal Assistant API",
    description="Intelligent legal support platform for Indian law",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(query.router, prefix="/api/query", tags=["Legal Query"])
app.include_router(report.router, prefix="/api/report", tags=["Report"])

@app.get("/")
def root():
    return {"message": "AI Legal Assistant API is running"}
