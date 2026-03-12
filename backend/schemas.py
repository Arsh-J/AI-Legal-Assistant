from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str


class QueryRequest(BaseModel):
    query_text: str

class IPCSectionOut(BaseModel):
    section_number: str
    title: str
    description: str
    punishment: str
    fine: Optional[str] = None
    reference_link: Optional[str] = None

    class Config:
        from_attributes = True

class LegalAnalysis(BaseModel):
    legal_category: str
    summary: str
    relevant_sections: List[IPCSectionOut]
    possible_outcomes: List[str]
    precautions: List[str]
    recommended_actions: List[str]

class QueryResponse(BaseModel):
    query_id: int
    query_text: str
    analysis: LegalAnalysis
    timestamp: datetime

    class Config:
        from_attributes = True
