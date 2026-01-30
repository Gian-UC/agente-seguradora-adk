def classify_case(history: list) -> dict:
    """
    Classifica o tipo de atendimento e identifica urgência usando Gemini.
    """
    historico_txt = ""
    for idx, msg in enumerate(history):
        quem = "Usuário" if msg.get("who") == "user" else "Agente"
        tipo = msg.get("type", "text")
        if tipo == "image":
            historico_txt += f"{idx+1}. {quem}: [Imagem enviada] (visualize no chat)\n"
        else:
            historico_txt += f"{idx+1}. {quem}: {msg.get('content','')}\n"
    prompt = f"""
Você é um agente de seguros inteligente. Analise o histórico do atendimento abaixo e responda APENAS um JSON com os campos:
{{
  "tipo_atendimento": "sinistro | dúvida | acompanhamento | outro",
  "urgente": true/false,
  "motivo_urgencia": "(explique se urgente, senão deixe vazio)"
}}
Histórico:
{historico_txt}
Responda sempre em português (PT/BR).
"""
    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt
    )
    text = response.text.strip()
    if text.startswith("```"):
        text = text.replace("```json", "").replace("```", "").strip()
    try:
        return json.loads(text)
    except Exception:
        return {"erro": "Não foi possível classificar o atendimento.", "resposta": text}
def extract_budget_data(budget_text: str) -> dict:
    """
    Extrai dados estruturados de um orçamento em texto usando Gemini.
    """
    prompt = f"""
Você é um agente de seguros especializado em análise de orçamentos automotivos.

Recebeu o seguinte orçamento:
"""
    prompt += budget_text + "\n"
    prompt += """
Extraia e retorne APENAS um JSON com os seguintes campos:
{
  "oficina": "Nome da oficina, se houver",
  "itens": [
    {"peca": "nome da peça", "valor": 0.0, "quantidade": 1}
  ],
  "total": 0.0,
  "data_orcamento": "data, se houver",
  "observacoes": ""
}
Se algum campo não estiver presente, deixe vazio ou nulo.
Responda sempre em português (PT/BR).
"""
    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt
    )
    text = response.text.strip()
    if text.startswith("```"):
        text = text.replace("```json", "").replace("```", "").strip()
    try:
        return json.loads(text)
    except Exception:
        return {"erro": "Não foi possível extrair os dados do orçamento.", "resposta": text}
def generate_report(history: list, last_analysis: dict = None) -> str:
    """
    Gera um resumo inteligente do atendimento usando Gemini, com base no histórico completo e análise final (opcional).
    """
    historico_txt = ""
    for idx, msg in enumerate(history):
        quem = "Usuário" if msg.get("who") == "user" else "Agente"
        tipo = msg.get("type", "text")
        if tipo == "image":
            historico_txt += f"{idx+1}. {quem}: [Imagem enviada] (visualize no chat)\n"
        else:
            historico_txt += f"{idx+1}. {quem}: {msg.get('content','')}\n"
    prompt = f"""
Você é o agente Aegis AI – Vehicle Claims Agent, especializado em análise de sinistros automotivos.

Seu objetivo é gerar um resumo detalhado, claro e humano do atendimento abaixo, explicando o caso do cliente, principais pontos discutidos, decisões tomadas e próximos passos recomendados.

Histórico do atendimento:
{historico_txt}
"""
    if last_analysis:
        prompt += f"\nAnálise final do carro:\n{json.dumps(last_analysis, indent=2, ensure_ascii=False)}\n"
    prompt += "\nGere o resumo em português (PT/BR), de forma profissional e compreensível para o cliente."
    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt
    )
    return response.text.strip()
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

def followup_analysis(last_analysis: dict, question: str, history: list) -> str:
    """
    Responde perguntas usando todo o histórico do atendimento como contexto
    """
    # Monta o histórico em formato detalhado e legível
    historico_txt = ""
    for idx, msg in enumerate(history):
        quem = "Usuário" if msg.get("who") == "user" else "Agente"
        tipo = msg.get("type", "text")
        if tipo == "image":
            historico_txt += f"{idx+1}. {quem}: [Imagem enviada] (visualize no chat)\n"
        else:
            historico_txt += f"{idx+1}. {quem}: {msg.get('content','')}\n"

    prompt = f"""
Você é o agente Aegis AI – Vehicle Claims Agent, especializado em análise de sinistros automotivos.

Responda sempre em português (PT/BR).

Seu objetivo é:
- Responder de forma clara, objetiva, empática e proativa.
- Analisar o sentimento do usuário (satisfeito, neutro, insatisfeito) e identificar sinais de urgência.
- Sugerir próximos passos práticos para o usuário, se possível.
- Utilizar todo o contexto do histórico para enriquecer sua resposta.

Aqui está o histórico completo do atendimento (mensagens, imagens e orçamentos):
{historico_txt}

Aqui está a análise anterior do carro:
{json.dumps(last_analysis, indent=2, ensure_ascii=False)}

Agora responda à última pergunta do cliente de forma humana, sem repetir o JSON, e demonstre atenção ao contexto e sentimento do usuário.
"""

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt
    )

    return response.text.strip()