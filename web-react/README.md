
# Aegis AI – Vehicle Claims Agent


<!-- Badges Gerais -->
![GitHub last commit](https://img.shields.io/github/last-commit/Gian-UC/agente-seguradora-adk)
![GitHub repo size](https://img.shields.io/github/repo-size/Gian-UC/agente-seguradora-adk)
![GitHub issues](https://img.shields.io/github/issues/Gian-UC/agente-seguradora-adk)
![GitHub stars](https://img.shields.io/github/stars/Gian-UC/agente-seguradora-adk?style=social)

<!-- Badges Frontend -->
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
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

### Frontend
```bash
cd web-react
npm install
npm run dev
```

### Backend
```bash
uvicorn main:app --reload
```

## Contribuição

Pull requests são bem-vindos! Abra uma issue para discutir melhorias ou bugs.
