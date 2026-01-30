
# Aegis AI – Vehicle Claims Agent


<!-- Badges Gerais -->
![GitHub last commit](https://img.shields.io/github/last-commit/Gian-UC/agente-seguradora-adk)
![GitHub repo size](https://img.shields.io/github/repo-size/Gian-UC/agente-seguradora-adk)
![GitHub issues](https://img.shields.io/github/issues/Gian-UC/agente-seguradora-adk)
![GitHub stars](https://img.shields.io/github/stars/Gian-UC/agente-seguradora-adk?style=social)

<!-- Badges Frontend -->

<!-- Badges Frontend -->
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=fff)
![NPM](https://img.shields.io/badge/NPM-CB3837?logo=npm&logoColor=fff)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=fff)
![License](https://img.shields.io/github/license/Gian-UC/agente-seguradora-adk)

Aplicação completa de atendimento inteligente para seguradoras, com análise de imagens e orçamentos, chat persistente e UX moderna.

## Tecnologias Utilizadas

- ⚡ **Vite**
- ⚛️ **React**
- 🦄 **FastAPI** (backend)
- 🤖 **Gemini API** (Google GenAI)
- 🖼️ **Pillow** (PIL)
- 📦 **jsPDF** (geração de PDF)
- 💬 **localStorage** (persistência do chat)
- 🎨 **CSS customizado**

## Funcionalidades

- Upload de múltiplas imagens
- Análise automática de orçamento e imagens
- Chat persistente (mesmo após atualizar a página)
- Botão para limpar conversa
- Resposta da IA contextual e humanizada
- Geração de relatório em PDF
- Classificação e extração de dados do orçamento


## Como rodar o projeto

### Pré-requisitos

- Node.js 18+ (https://nodejs.org/)
- NPM 9+ (já incluso no Node)
- Python 3.10+
- FastAPI e Uvicorn

### Instalação e execução do Frontend (React + Vite)

1. Acesse a pasta do frontend:
	```bash
	cd web-react
	```
2. Instale as dependências:
	```bash
	npm install
	```
3. Rode o servidor de desenvolvimento:
	```bash
	npm run dev
	```
4. Acesse em [http://localhost:5173](http://localhost:5173)

### Instalação e execução do Backend (FastAPI)

1. Instale as dependências do Python (recomenda-se uso de venv):
	```bash
	pip install -r requirements.txt
	```
2. Rode o backend:
	```bash
	uvicorn main:app --reload
	```
3. O backend estará disponível em [http://127.0.0.1:8000](http://127.0.0.1:8000)

## Contribuição

Pull requests são bem-vindos! Abra uma issue para discutir melhorias ou bugs.
