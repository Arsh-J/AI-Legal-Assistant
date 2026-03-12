@echo off
echo Starting AI Legal Assistant Backend...
cd backend
call venv\Scripts\activate
uvicorn main:app --reload --port 8000
