from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

from ai.analyzer import analyze_car, followup_analysis

app = FastAPI(title="Agente de Seguradora IA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(
    image: UploadFile = File(...),
    budget: str = Form(...)
):
    image_bytes = await image.read()
    pil_image = Image.open(io.BytesIO(image_bytes))

    result = analyze_car(
        image=pil_image,
        orcamento=budget
    )

    return result

from pydantic import BaseModel

class FollowUpRequest(BaseModel):
    history: list
    last_analysis: dict
    
@app.post("/followup")
async def followup(data: FollowUpRequest):
    """
    Responde perguntas do usuário usando a nálise anterior como contexto    
    """
    
    prompt = f"""
Você é um agente de seguradora de veículos.

Aqui está a análise anterior do carro:
{data.last_analysis}

Agora responda de forma clara, objetiva e humana à pergunta do usuário,
sem repetir o JSON completo, apenas explicando.
"""

    question = data.history[-1]["content"]
    
    result = followup_analysis(
        last_analysis=data.last_analysis,
        question=question
    )
    
    return  {
        "answer": result
    }