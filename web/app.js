const chat = document.getElementById("chat");
const imageInput = document.getElementById("imageInput");
const mainInput = document.getElementById("mainInput");
const analyzeBtn = document.getElementById("analyzeBtn");



// Gerenciar imagens selecionadas
let selectedImages = [];
const imagePreviewContainer = document.getElementById("imagePreviewContainer");

function renderImagePreviews() {
  imagePreviewContainer.innerHTML = "";
  selectedImages.forEach((file, idx) => {
    const imagePreview = URL.createObjectURL(file);
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";
    wrapper.style.marginRight = "8px";
    const img = document.createElement("img");
    img.src = imagePreview;
    img.alt = "Prévia da imagem";
    img.style.maxWidth = "80px";
    img.style.maxHeight = "80px";
    img.style.borderRadius = "10px";
    img.style.border = "2px solid #2a61ff";
    img.style.background = "#151e36";
    img.style.objectFit = "cover";
    img.style.boxShadow = "0 2px 8px 0 rgba(42,97,255,0.08)";
    // Botão X
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.title = "Remover imagem";
    removeBtn.style.position = "absolute";
    removeBtn.style.top = "-8px";
    removeBtn.style.right = "-8px";
    removeBtn.style.background = "#2a61ff";
    removeBtn.style.color = "#fff";
    removeBtn.style.border = "none";
    removeBtn.style.borderRadius = "50%";
    removeBtn.style.width = "22px";
    removeBtn.style.height = "22px";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.fontWeight = "bold";
    removeBtn.style.fontSize = "16px";
    removeBtn.style.display = "flex";
    removeBtn.style.alignItems = "center";
    removeBtn.style.justifyContent = "center";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedImages.splice(idx, 1);
      renderImagePreviews();
    });
    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);
    imagePreviewContainer.appendChild(wrapper);
  });
}

imageInput.addEventListener("change", () => {
  const newFiles = Array.from(imageInput.files);
  // Adiciona apenas arquivos ainda não presentes (evita duplicatas)
  newFiles.forEach(file => {
    if (!selectedImages.some(f => f.name === file.name && f.size === file.size)) {
      selectedImages.push(file);
    }
  });
  renderImagePreviews();
  // Limpa o input para permitir selecionar o mesmo arquivo novamente se quiser
  imageInput.value = "";
});

let conversationHistory = [];
let lastAnalysisResult = null;

function addBubble(content, who = "bot", type = "text") {
  const div = document.createElement("div");
  div.className = `bubble ${who}`;
  if (type === "image") {
    const img = document.createElement("img");
    img.src = content;
    img.className = "chat-image";
    div.appendChild(img);
  } else {
    // Se for a primeira mensagem do bot, personaliza com o nome do agente
    if (who === "bot" && chat.children.length === 0) {
      div.textContent = "Olá! Eu sou o Aegis AI – Vehicle Claims Agent. " + content;
    } else {
      div.textContent = content;
    }
  }
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}


analyzeBtn.addEventListener("click", async () => {
  const files = selectedImages;
  const inputText = mainInput.value.trim();

  // Sempre que houver imagens anexadas, faz nova análise
  if (files.length) {
    if (!inputText) {
      addBubble("Por favor, insira o orçamento ou contexto.", "bot");
      return;
    }
    files.forEach(file => {
      const imagePreview = URL.createObjectURL(file);
      addBubble(imagePreview, "user", "image");
    });
    addBubble(`Imagens anexadas: ${files.map(f => f.name).join(", ")}\nOrçamento:\n${inputText}`, "user");
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "Analisando...";
    try {
      const formData = new FormData();
      formData.append("image", files[0]);
      formData.append("budget", inputText);
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Erro HTTP ${res.status}: ${errText}`);
      }
      const data = await res.json();
      lastAnalysisResult = data;
      conversationHistory.push({
        role: "assistant",
        content: data,
      });
      if (data && data.notes) {
        addBubble(data.notes, "bot");
      } else {
        const pretty = JSON.stringify(data, null, 2);
        addBubble(pretty, "bot");
      }
      mainInput.value = "";
      selectedImages = [];
      renderImagePreviews();
    } catch (err) {
      addBubble(`Erro: ${err.message}`, "bot");
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = "🔍 Analisar/Perguntar";
    }
    return;
  }

  // Se não houver imagens, faz pergunta/followup
  if (!inputText) {
    addBubble("Digite sua pergunta sobre a análise.", "bot");
    return;
  }
  addBubble(inputText, "user");
  conversationHistory.push({
    role: "user",
    content: inputText,
  });
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "Perguntando...";
  try {
    const res = await fetch("http://127.0.0.1:8000/followup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        history: conversationHistory,
        last_analysis: lastAnalysisResult,
      }),
    });
    const data = await res.json();
    addBubble(data.answer, "bot");
    conversationHistory.push({
      role: "assistant",
      content: data.answer
    });
    mainInput.value = "";
  } catch (err) {
    addBubble(`Erro: ${err.message}`, "bot");
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "🔍 Analisar/Perguntar";
  }
});