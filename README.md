


# Aegis AI – Vehicle Claims Agent

Agente inteligente para análise de sinistros automotivos via IA

<p>
	<a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3.10%2B-blue?logo=python" alt="Python"></a>
	<a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-async-green?logo=fastapi" alt="FastAPI"></a>
	<a href="https://github.com/google/generative-ai-python"><img src="https://img.shields.io/badge/Google%20Gemini-API-yellow?logo=google" alt="Google Gemini"></a>
	<a href="https://pypi.org/project/python-dotenv/"><img src="https://img.shields.io/badge/dotenv-env-lightgrey?logo=python"></a>
	<a href="https://pillow.readthedocs.io/"><img src="https://img.shields.io/badge/Pillow-image-blue?logo=pillow"></a>
	<a href="https://uvicorn.org/"><img src="https://img.shields.io/badge/Uvicorn-ASGI-black?logo=uvicorn"></a>

  <!-- Badges Frontend -->
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB" alt="React"></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff" alt="Vite"></a>
  <a href="https://eslint.org/"><img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=fff" alt="ESLint"></a>
  <a href="https://github.com/Gian-UC/agente-seguradora-adk/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Gian-UC/agente-seguradora-adk" alt="License"></a>
</p>

---

## 📑 Índice

1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Funcionalidades](#-funcionalidades)
3. [Como Rodar o Projeto](#-como-rodar-o-projeto)
4. [Principais Dependências](#-principais-dependências)
5. [Estrutura do Projeto](#-estrutura-do-projeto)
6. [Observações](#-observações)
7. [Contribuição](#-contribuição)
8. [Licença](#-licença)
9. [Contato](#-contato)

## 🚗 Sobre o Projeto

O **Aegis AI – Vehicle Claims Agent** é um agente inteligente que analisa imagens de veículos e orçamentos de oficinas para auxiliar seguradoras na avaliação de sinistros automotivos. Utiliza IA generativa (Google Gemini) para gerar laudos, estimar danos, custos e responder perguntas sobre o caso.

### Funcionalidades
- Upload de imagem(s) do veículo
- Envio de orçamento da oficina
- Análise automática do sinistro (gravidade, áreas afetadas, custo estimado, observações)
- Chat para perguntas e respostas sobre o caso
- Interface web moderna, responsiva e com favicon personalizado
- API backend em FastAPI
- Prompt sempre em português (PT/BR)

---


## ⚡ Como Rodar o Projeto

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/agente-seguradora-adk.git
cd agente-seguradora-adk
```

### 2. Instale o Python (>=3.10)
- [Download Python](https://www.python.org/downloads/)

### 3. Crie e ative um ambiente virtual (opcional, recomendado)
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

### 4. Instale as dependências
```bash
pip install -r requirements.txt
```

### 5. Configure a chave da API Gemini
- Crie um arquivo `.env` na raiz do projeto:
```
GEMINI_API_KEY=seu_token_aqui
```
- Obtenha sua chave em: [Google AI Studio](https://aistudio.google.com/app/apikey)

### 6. Execute o backend (FastAPI)
```bash
uvicorn main:app --reload
```


### 7. Execute o frontend (React + Vite)

#### Pré-requisitos:
- [Node.js](https://nodejs.org/) (recomendado v18+)
- [npm](https://www.npmjs.com/) (já incluso no Node.js)

#### Passos:
```bash
cd web-react
npm install
npm run dev
```

- O frontend estará disponível em: [http://localhost:5173](http://localhost:5173)
- O favicon SVG moderno já está incluso!

---

## 📦 Principais Dependências
- [FastAPI](https://fastapi.tiangolo.com/)
- [Uvicorn](https://www.uvicorn.org/)
- [Google Generative AI (Gemini)](https://github.com/google/generative-ai-python)
- [python-dotenv](https://pypi.org/project/python-dotenv/)
- [Pillow](https://pillow.readthedocs.io/)

---

## 📝 Estrutura do Projeto
```
├── ai/
│   └── analyzer.py         # Lógica de análise IA
├── main.py                 # Backend FastAPI
├── requirements.txt        # Dependências
├── web/
│   ├── index.html          # Frontend
│   ├── style.css           # Estilos
│   └── app.js              # JS do frontend
└── .env                    # Chave Gemini
```

---

- O projeto utiliza IA generativa, podendo haver limites de uso na API Gemini.
- Para produção, recomenda-se configurar variáveis de ambiente e HTTPS.
- O frontend é responsivo, pode ser acessado por dispositivos móveis e já inclui favicon SVG.
- O prompt da IA força respostas sempre em português (PT/BR).

> **Nota:** 
- O projeto utiliza IA generativa, podendo haver limites de uso na API Gemini.
- Para produção, recomenda-se configurar variáveis de ambiente e HTTPS.
- O frontend é responsivo, pode ser acessado por dispositivos móveis e já inclui favicon SVG.
- O prompt da IA força respostas sempre em português (PT/BR).

## 📬 Contato
- [Giancarlo Salomone](mailto:g.salomone@live.com)
- [LinkedIn](https://www.linkedin.com/in/dev-giancarlo-salomone/)
