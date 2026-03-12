from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from database import get_db
from auth_utils import get_current_user
import models, schemas
from agents.orchestrator import run_legal_analysis

router = APIRouter()

@router.post("/analyze", response_model=schemas.QueryResponse)
def analyze_query(
    request: schemas.QueryRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not request.query_text.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    analysis = run_legal_analysis(request.query_text)

    sections = []
    for s in analysis.get("relevant_sections", []):
        sections.append(schemas.IPCSectionOut(
            section_number=s.get("section_number", "N/A"),
            title=s.get("title", ""),
            description=s.get("description", ""),
            punishment=s.get("punishment", ""),
            fine=s.get("fine"),
            reference_link=s.get("reference_link")
        ))

    analysis_obj = schemas.LegalAnalysis(
        legal_category=analysis["legal_category"],
        summary=analysis["summary"],
        relevant_sections=sections,
        possible_outcomes=analysis.get("possible_outcomes", []),
        precautions=analysis.get("precautions", []),
        recommended_actions=analysis.get("recommended_actions", [])
    )

    db_query = models.UserQuery(
        user_id=current_user.id,
        query_text=request.query_text,
        analysis_result=analysis_obj.model_dump_json()
    )
    db.add(db_query)
    db.commit()
    db.refresh(db_query)

    return schemas.QueryResponse(
        query_id=db_query.query_id,
        query_text=db_query.query_text,
        analysis=analysis_obj,
        timestamp=db_query.timestamp
    )


@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    queries = db.query(models.UserQuery).filter(
        models.UserQuery.user_id == current_user.id
    ).order_by(models.UserQuery.timestamp.desc()).limit(50).all()

    return [
        {
            "query_id": q.query_id,
            "query_text": q.query_text,
            "timestamp": q.timestamp.isoformat() if q.timestamp else "",
        }
        for q in queries
    ]


@router.get("/{query_id}")
def get_query(
    query_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    q = db.query(models.UserQuery).filter(
        models.UserQuery.query_id == query_id,
        models.UserQuery.user_id == current_user.id
    ).first()
    if not q:
        raise HTTPException(status_code=404, detail="Query not found")

    analysis_data = json.loads(q.analysis_result) if q.analysis_result else {}
    return {
        "query_id": q.query_id,
        "query_text": q.query_text,
        "analysis": analysis_data,
        "timestamp": q.timestamp.isoformat() if q.timestamp else "",
    }


@router.delete("/history")
def delete_all_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db.query(models.UserQuery).filter(
        models.UserQuery.user_id == current_user.id
    ).delete(synchronize_session=False)
    db.commit()
    return {"message": "All history deleted"}


@router.delete("/{query_id}")
def delete_query(
    query_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    q = db.query(models.UserQuery).filter(
        models.UserQuery.query_id == query_id,
        models.UserQuery.user_id == current_user.id
    ).first()
    if not q:
        raise HTTPException(status_code=404, detail="Query not found")
    db.delete(q)
    db.commit()
    return {"message": "Deleted"}
