import os
import json
from dotenv import load_dotenv
from google import genai
from PIL import Image

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_car(image: Image.Image, orcamento: str) -> str:
    """
    Recebe a imagem do carro e o texto do orçamento
    Retorna um JSON com a análise do agente    
    """ 
    
    prompt = f"""
Você é o agente Aegis AI – Vehicle Claims Agent, especializado em análise de sinistros automotivos.

Responda sempre em português (PT/BR).

Analise a imagem do veículo e o orçamento abaixo.

Retorne APENAS um JSON com este formato:
{{
    "damage_severity": "none | light | moderate | severe",
    "affected_areas": [],
    "estimated_cost_range": {{
        "min": 0,
        "max": 0,
        "currency": "BRL"
    }},
    "budget_is_reasonable": true,
    "notes": "",
    "confidence": 0.0
}}

ORÇAMENTO:
{orcamento}
"""

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=[prompt, image]
    )
    
    text = response.text.strip()
    
    if text.startswith("```"):
        text = text.replace("```json", "").replace("```", "").strip()
    
    return json.loads(text)

def followup_analysis(last_analysis: dict, question: str) -> str:
    """
    
    Responde perguntas usando a análise anterior como contexto
    """
    
    prompt = f"""
Você é o agente Aegis AI – Vehicle Claims Agent, especializado em análise de sinistros automotivos.

Responda sempre em português (PT/BR).

Aqui está a análise anterior do carro:
{json.dumps(last_analysis, indent=2, ensure_ascii=False)}

Agora responda a pergunta do cliente de forma clara,
humana e objetiva, sem repetir o JSON.

Pergunta:
{question}
"""

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt
    )

    return response.text.strip()