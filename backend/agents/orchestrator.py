import os
import json
import re
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

_gemini_available = False
if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        _gemini_available = True
        print("[INFO] Gemini API configured successfully.")
    except Exception as e:
        print(f"[WARNING] Gemini init failed: {e}. Using mock responses.")
else:
    print("[INFO] No Gemini API key — using intelligent mock responses.")


def _call_gemini(prompt: str) -> str:
    import google.generativeai as genai
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    return response.text.strip()


def _extract_json(text: str):
    text = re.sub(r"```(?:json)?", "", text).replace("```", "").strip()
    for start_char, end_char in [("[", "]"), ("{", "}")]:
        idx = text.find(start_char)
        if idx != -1:
            ridx = text.rfind(end_char)
            if ridx != -1:
                try:
                    return json.loads(text[idx: ridx + 1])
                except Exception:
                    continue
    return json.loads(text)


def case_understanding_agent(query: str) -> Dict[str, Any]:
    if not _gemini_available:
        return _mock_understanding(query)
    try:
        prompt = f"""You are a legal expert specializing in Indian law.
Analyze this legal query and return a JSON object with EXACTLY these keys:
- "legal_category": string (e.g. "Criminal - Fraud", "Labour Law", "Property Law", "Cyber Crime", "Family Law")
- "keywords": array of 3-5 key legal terms as strings
- "severity": string, one of "low", "medium", "high"

Query: {query}

Respond with ONLY the JSON object. No explanation. No markdown."""
        raw = _call_gemini(prompt)
        result = _extract_json(raw)
        if isinstance(result, dict) and "legal_category" in result:
            return result
    except Exception as e:
        print(f"[Agent1 Error] {e}")
    return _mock_understanding(query)


def legal_retrieval_agent(query: str, category: str, keywords: List[str]) -> List[Dict]:
    if not _gemini_available:
        return _mock_ipc_sections(query)
    try:
        kw_str = ", ".join(keywords) if keywords else query[:50]
        prompt = f"""You are an expert on Indian Penal Code (IPC) and Indian laws.
Identify the 3-4 most relevant IPC sections or legal provisions for this situation.

Query: {query}
Legal Category: {category}
Keywords: {kw_str}

Return a JSON ARRAY. Each element must have EXACTLY these keys:
- "section_number": string like "IPC 420" or "IPC 302"
- "title": short title string
- "description": 1-2 sentence description
- "punishment": string describing punishment
- "fine": string like "Up to Rs. 1000" or "As per court discretion"
- "reference_link": string URL like "https://indiankanoon.org/doc/1306166/"

Respond with ONLY the JSON array. No explanation. No markdown."""
        raw = _call_gemini(prompt)
        result = _extract_json(raw)
        if isinstance(result, list) and len(result) > 0:
            return result
    except Exception as e:
        print(f"[Agent2 Error] {e}")
    return _mock_ipc_sections(query)


def outcome_prediction_agent(query: str, sections: List[Dict]) -> List[str]:
    if not _gemini_available:
        return _mock_outcomes(query)
    try:
        sec_text = "\n".join([f"- {s.get('section_number','')}: {s.get('punishment','')}" for s in sections])
        prompt = f"""You are a legal expert predicting possible outcomes under Indian law.

Query: {query}
Applicable sections:
{sec_text}

List 4-5 possible legal outcomes as a JSON array of strings.
Consider arrest, bail, trial, imprisonment, fines, civil remedies.

Respond with ONLY a JSON array of strings. No markdown."""
        raw = _call_gemini(prompt)
        result = _extract_json(raw)
        if isinstance(result, list) and len(result) > 0:
            return [str(r) for r in result]
    except Exception as e:
        print(f"[Agent3 Error] {e}")
    return _mock_outcomes(query)


def precaution_advisor_agent(query: str, category: str) -> Dict[str, List[str]]:
    if not _gemini_available:
        return _mock_precautions(query)
    try:
        prompt = f"""You are a legal advisor helping someone in India navigate a legal situation.

Query: {query}
Category: {category}

Return a JSON object with EXACTLY two keys:
- "precautions": array of 4-5 strings (things to do/avoid right now)
- "recommended_actions": array of 4-5 strings (concrete next steps to take)

Respond with ONLY the JSON object. No markdown."""
        raw = _call_gemini(prompt)
        result = _extract_json(raw)
        if isinstance(result, dict) and "precautions" in result:
            return result
    except Exception as e:
        print(f"[Agent4 Error] {e}")
    return _mock_precautions(query)


def case_summarizer_agent(query: str, category: str, sections: List[Dict]) -> str:
    if not _gemini_available:
        return _mock_summary(query, category, sections)
    try:
        sec_names = ", ".join([s.get("section_number", "") for s in sections[:3]])
        prompt = f"""You are a legal expert explaining a case in simple language for a general Indian citizen.

Original query: {query}
Legal category: {category}
Applicable sections: {sec_names}

Write a clear 3-sentence summary:
1. What legal issue this is
2. Which laws apply and why
3. What the person should know or do

Use simple English. No jargon. Return ONLY the plain text summary."""
        return _call_gemini(prompt).strip()
    except Exception as e:
        print(f"[Agent5 Error] {e}")
    return _mock_summary(query, category, sections)


def run_legal_analysis(query: str) -> Dict[str, Any]:
    print(f"[Orchestrator] Analyzing: {query[:60]}...")

    understanding = case_understanding_agent(query)
    category = understanding.get("legal_category", "General Legal Matter")
    keywords = understanding.get("keywords", [])

    sections = legal_retrieval_agent(query, category, keywords)
    outcomes = outcome_prediction_agent(query, sections)
    advice = precaution_advisor_agent(query, category)
    summary = case_summarizer_agent(query, category, sections)

    return {
        "legal_category": category,
        "summary": summary,
        "relevant_sections": sections,
        "possible_outcomes": outcomes,
        "precautions": advice.get("precautions", []),
        "recommended_actions": advice.get("recommended_actions", []),
    }


# ─── Smart Mock Responses ─────────────────────────────────────────────────────
def _detect_category(query: str) -> str:
    q = query.lower()
    if any(w in q for w in ["theft", "steal", "rob", "burglary"]):
        return "Criminal - Theft"
    if any(w in q for w in ["fraud", "cheat", "scam", "deceive", "money", "fake"]):
        return "Criminal - Fraud & Cheating"
    if any(w in q for w in ["murder", "kill", "death", "homicide"]):
        return "Criminal - Homicide"
    if any(w in q for w in ["assault", "beat", "attack", "hurt", "injury"]):
        return "Criminal - Assault"
    if any(w in q for w in ["cyber", "hack", "online", "phishing", "blackmail", "photo", "sextortion"]):
        return "Cyber Crime"
    if any(w in q for w in ["salary", "wage", "employer", "employee", "job", "fired", "labour"]):
        return "Labour Law"
    if any(w in q for w in ["property", "land", "house", "flat", "rent", "tenant", "landlord", "deposit"]):
        return "Property / Civil Law"
    if any(w in q for w in ["domestic", "wife", "husband", "divorce", "marriage", "dowry"]):
        return "Family Law"
    if any(w in q for w in ["consumer", "product", "defective", "refund", "seller"]):
        return "Consumer Law"
    return "General Criminal Law"


def _mock_understanding(query: str) -> Dict:
    cat = _detect_category(query)
    words = [w for w in query.lower().split() if len(w) > 4][:5]
    return {"legal_category": cat, "keywords": words or ["legal", "complaint", "india"], "severity": "medium"}


def _mock_ipc_sections(query: str) -> List[Dict]:
    q = query.lower()
    if any(w in q for w in ["theft", "steal", "rob"]):
        return [
            {"section_number": "IPC 379", "title": "Theft", "description": "Whoever commits theft shall be punished with imprisonment or fine.", "punishment": "Imprisonment up to 3 years, or fine, or both", "fine": "As per court discretion", "reference_link": "https://indiankanoon.org/doc/1380537/"},
            {"section_number": "IPC 380", "title": "Theft in dwelling house", "description": "Theft committed in any building, tent, or vessel used as a human dwelling.", "punishment": "Imprisonment up to 7 years and fine", "fine": "As per court discretion", "reference_link": "https://indiankanoon.org/doc/1436138/"},
        ]
    if any(w in q for w in ["fraud", "cheat", "scam", "deceive", "payment", "money", "job"]):
        return [
            {"section_number": "IPC 420", "title": "Cheating and dishonestly inducing delivery of property", "description": "Whoever cheats and dishonestly induces another to deliver property or alter a valuable security.", "punishment": "Imprisonment up to 7 years and fine", "fine": "As per court discretion", "reference_link": "https://indiankanoon.org/doc/1306166/"},
            {"section_number": "IPC 406", "title": "Criminal breach of trust", "description": "Dishonest misappropriation of property entrusted to a person.", "punishment": "Imprisonment up to 3 years, or fine, or both", "fine": "As per court discretion", "reference_link": "https://indiankanoon.org/doc/1941644/"},
            {"section_number": "IPC 415", "title": "Cheating (definition)", "description": "Whoever deceives any person, fraudulently inducing them to deliver property.", "punishment": "Imprisonment up to 1 year, or fine, or both", "fine": "As per court discretion", "reference_link": "https://indiankanoon.org/doc/1305024/"},
        ]
    if any(w in q for w in ["cyber", "hack", "photo", "blackmail", "online", "sextortion"]):
        return [
            {"section_number": "IT Act 66C", "title": "Identity theft", "description": "Fraudulently using electronic signature, password, or unique identification feature of another person.", "punishment": "Imprisonment up to 3 years and fine up to Rs. 1 lakh", "fine": "Up to Rs. 1,00,000", "reference_link": "https://indiankanoon.org/doc/1439440/"},
            {"section_number": "IT Act 66E", "title": "Violation of privacy", "description": "Capturing, publishing, or transmitting image of a private area without consent.", "punishment": "Imprisonment up to 3 years or fine up to Rs. 2 lakh or both", "fine": "Up to Rs. 2,00,000", "reference_link": "https://indiankanoon.org/doc/1439440/"},
            {"section_number": "IPC 384", "title": "Extortion / Blackmail", "description": "Putting a person in fear of injury to commit extortion and take property.", "punishment": "Imprisonment up to 3 years, or fine, or both", "fine": "As per court discretion", "reference_link": "https://indiankanoon.org/doc/1974838/"},
        ]
    if any(w in q for w in ["salary", "wage", "employer", "unpaid"]):
        return [
            {"section_number": "Payment of Wages Act", "title": "Non-payment of wages", "description": "Every employer must pay wages on time. Withholding wages is an offence under this Act.", "punishment": "Fine up to Rs. 7,500 for first offence; Rs. 22,500 for repeat", "fine": "Up to Rs. 22,500", "reference_link": "https://indiankanoon.org/search/?formInput=payment+of+wages+act"},
            {"section_number": "IPC 406", "title": "Criminal breach of trust", "description": "If employer withholds salary that was entrusted to him for disbursement.", "punishment": "Imprisonment up to 3 years, or fine, or both", "fine": "As per court discretion", "reference_link": "https://indiankanoon.org/doc/1941644/"},
        ]
    if any(w in q for w in ["landlord", "deposit", "rent", "tenant", "flat"]):
        return [
            {"section_number": "IPC 406", "title": "Criminal breach of trust", "description": "Non-return of security deposit held in trust can amount to criminal breach of trust.", "punishment": "Imprisonment up to 3 years, or fine, or both", "fine": "As per court discretion", "reference_link": "https://indiankanoon.org/doc/1941644/"},
            {"section_number": "Transfer of Property Act S.108", "title": "Landlord-Tenant obligations", "description": "Defines the rights and liabilities of lessor and lessee regarding deposit, maintenance, and recovery.", "punishment": "Civil damages and recovery through court", "fine": "Civil suit for recovery", "reference_link": "https://indiankanoon.org/search/?formInput=transfer+property+act+108"},
        ]
    if any(w in q for w in ["assault", "beat", "hit", "attack", "hurt"]):
        return [
            {"section_number": "IPC 351", "title": "Assault", "description": "Making any gesture intending to cause apprehension that criminal force will be used.", "punishment": "Imprisonment up to 3 months, or fine up to Rs. 500, or both", "fine": "Up to Rs. 500", "reference_link": "https://indiankanoon.org/doc/1141164/"},
            {"section_number": "IPC 323", "title": "Voluntarily causing hurt", "description": "Whoever voluntarily causes hurt shall be punished.", "punishment": "Imprisonment up to 1 year, or fine up to Rs. 1000, or both", "fine": "Up to Rs. 1,000", "reference_link": "https://indiankanoon.org/doc/1011035/"},
        ]
    return [
        {"section_number": "IPC 420", "title": "Cheating", "description": "Cheating and dishonestly inducing delivery of property.", "punishment": "Imprisonment up to 7 years and fine", "fine": "As per court discretion", "reference_link": "https://indiankanoon.org/doc/1306166/"},
        {"section_number": "IPC 406", "title": "Criminal Breach of Trust", "description": "Dishonest misappropriation of property entrusted to a person.", "punishment": "Imprisonment up to 3 years, or fine, or both", "fine": "As per court discretion", "reference_link": "https://indiankanoon.org/doc/1941644/"},
    ]


def _mock_outcomes(query: str) -> List[str]:
    q = query.lower()
    if any(w in q for w in ["salary", "wage", "employer"]):
        return [
            "File a complaint with the Labour Commissioner or Labour Court",
            "Court may order employer to pay all pending wages with interest",
            "Employer may face fine under Payment of Wages Act",
            "Civil suit for recovery of dues is maintainable",
            "Repeated violations can result in criminal prosecution of the employer",
        ]
    if any(w in q for w in ["landlord", "deposit", "rent"]):
        return [
            "You can send a legal notice demanding return of deposit within 30 days",
            "File a case in Consumer Forum or Civil Court for recovery",
            "Court can order return of deposit with interest and legal costs",
            "Mediation through Rent Authority is a faster resolution option",
            "Landlord may face penalty if registered lease terms are violated",
        ]
    return [
        "FIR can be filed at the nearest police station under applicable sections",
        "Police will investigate and may arrest the accused if evidence is sufficient",
        "Bail may be granted depending on the nature and severity of the offence",
        "Court trial with presentation of evidence by both sides will follow",
        "Conviction can result in imprisonment and/or fine as per applicable IPC section",
    ]


def _mock_precautions(query: str) -> Dict:
    q = query.lower()
    if any(w in q for w in ["cyber", "photo", "blackmail", "online"]):
        return {
            "precautions": [
                "Do NOT pay any money to the blackmailer — payment encourages further threats",
                "Take screenshots of all threatening messages before blocking the person",
                "Block the perpetrator on all platforms only after preserving all evidence",
                "Do not delete any chats, emails, or call logs related to the incident",
                "Avoid sharing any further personal information online",
            ],
            "recommended_actions": [
                "File a complaint on the National Cyber Crime Portal (cybercrime.gov.in)",
                "Visit the nearest Cyber Crime Police Station with printed evidence",
                "Contact a lawyer specializing in cyber law immediately",
                "Report the account to the platform (WhatsApp/Instagram) for removal",
                "File an FIR under IT Act Section 66E and IPC 384",
            ]
        }
    return {
        "precautions": [
            "Preserve all relevant documents, messages, receipts, and agreements",
            "Do not tamper with, delete, or destroy any evidence",
            "Avoid discussing the matter publicly on social media",
            "Do not sign any documents or agreements without consulting a lawyer",
            "Keep a written record of all incidents with exact dates and times",
        ],
        "recommended_actions": [
            "Consult a qualified advocate in the relevant area of law immediately",
            "Send a formal legal notice to the opposing party through a lawyer",
            "File an FIR at the nearest police station if a cognizable offence occurred",
            "Gather and secure witness information and written statements",
            "Approach a Legal Aid Services center if you cannot afford a private lawyer",
        ]
    }


def _mock_summary(query: str, category: str, sections: List[Dict]) -> str:
    sec_nums = ", ".join([s.get("section_number", "") for s in sections[:2]])
    return (
        f"Based on your query, this matter falls under {category} in Indian law. "
        f"The applicable legal provisions include {sec_nums if sec_nums else 'relevant IPC sections'}, "
        f"which directly address the situation you have described. "
        f"It is strongly advised to consult a qualified advocate, preserve all evidence immediately, "
        f"and take prompt legal action to protect your rights."
    )
