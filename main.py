


from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import io
from ai.analyzer import analyze_car, followup_analysis, classify_case, extract_budget_data, generate_report

app = FastAPI(title="Agente de Seguradora IA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ENDPOINTS ---

class ClassifyCaseRequest(BaseModel):
    history: list

@app.post("/classify_case")
async def classify_case_endpoint(data: ClassifyCaseRequest):
    """
    Classifica o tipo de atendimento e identifica urgência usando Gemini.
    """
    resultado = classify_case(data.history)
    return {"classification": resultado}

class ExtractBudgetRequest(BaseModel):
    budget: str

@app.post("/extract_budget")
async def extract_budget(data: ExtractBudgetRequest):
    """
    Extrai dados estruturados de um orçamento em texto usando Gemini.
    """
    resultado = extract_budget_data(data.budget)
    return {"extracted": resultado}

class ReportRequest(BaseModel):
    history: list
    last_analysis: dict = None

@app.post("/report")
async def report(data: ReportRequest):
    """
    Gera um resumo inteligente do atendimento usando Gemini, com base no histórico completo e análise final (opcional).
    """
    resumo = generate_report(
        history=data.history,
        last_analysis=data.last_analysis
    )
    return {"report": resumo}

from typing import List, Optional

@app.post("/analyze")
async def analyze(
    images: Optional[List[UploadFile]] = File(None),
    history: str = Form(...)
):
    # Carrega todas as imagens enviadas (se houver)
    pil_images = []
    if images:
        for img_file in images:
            img_bytes = await img_file.read()
            pil_images.append(Image.open(io.BytesIO(img_bytes)))

    # Carrega o histórico enviado
    import json
    history_data = json.loads(history)

    # Busca o último orçamento enviado pelo usuário
    budget = None
    for msg in reversed(history_data):
        if msg.get("who") == "user" and msg.get("type") == "text":
            budget = msg.get("content")
            break

    # Chama a análise principal (usa só a primeira imagem, mas pode adaptar para múltiplas)
    analysis_result = analyze_car(
        image=pil_images[0] if pil_images else None,
        orcamento=budget
    )

    # Busca a última pergunta do usuário
    question = None
    for msg in reversed(history_data):
        if msg.get("who") == "user" and msg.get("type", "text") == "text":
            question = msg.get("content", "")
            break

    # Chama a resposta da IA para a pergunta do usuário
    answer = followup_analysis(
        last_analysis=analysis_result,
        question=question,
        history=history_data
    )

    return {
        "analysis": analysis_result,
        "response": answer
    }

class FollowUpRequest(BaseModel):
    history: list
    last_analysis: dict

@app.post("/followup")
async def followup(data: FollowUpRequest):
    """
    Responde perguntas do usuário usando todo o histórico do atendimento como contexto
    """
    question = ""
    # Busca a última mensagem do usuário
    for msg in reversed(data.history):
        if msg.get("who") == "user" and msg.get("type", "text") == "text":
            question = msg.get("content", "")
            break
    result = followup_analysis(
        last_analysis=data.last_analysis,
        question=question,
        history=data.history
    )
    return {
        "answer": result
    }