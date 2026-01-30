import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import Modal from './components/Modal';
import Alert from './components/Alert';
import Chat from './components/Chat';
import ImagePreview from './components/ImagePreview';
import InputPanel from './components/InputPanel';

function App() {
  // Handler para envio do input principal
  const [loading, setLoading] = useState(false);
  // Carrega histórico salvo do localStorage ao iniciar
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('aegis-chat');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [];
  });
  // Salva o histórico sempre que messages mudar
  useEffect(() => {
    localStorage.setItem('aegis-chat', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() && selectedImages.length === 0) {
      setAlert({ message: 'Digite uma mensagem ou anexe uma imagem.', type: 'error' });
      setTimeout(() => setAlert({ message: '', type: '' }), 2000);
      return;
    }
    setLoading(true);
    try {
      let newMessages = [...messages];
      // Adiciona mensagem de texto do usuário
      if (inputValue.trim()) {
        newMessages = [
          ...newMessages,
          { who: 'user', content: inputValue, type: 'text' }
        ];
      }
      // Adiciona imagens do usuário
      for (const img of selectedImages) {
        newMessages = [
          ...newMessages,
          { who: 'user', content: img.previewUrl, type: 'image' }
        ];
      }
      setMessages(newMessages);

      // Prepara dados para envio ao backend
      const formData = new FormData();
      formData.append('history', JSON.stringify(newMessages));
      selectedImages.forEach((img) => {
        formData.append('images', img.file, img.file.name);
      });

      // Envia para o backend
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Erro ao enviar para análise.');
      const data = await response.json();
      // Adiciona resposta do agente
      setMessages(msgs => ([
        ...msgs,
        { who: 'bot', content: data.response || 'Análise concluída.', type: 'text' }
      ]));
      setInputValue('');
      setSelectedImages([]);
    } catch (err) {
      setAlert({ message: err.message, type: 'error' });
      setTimeout(() => setAlert({ message: '', type: '' }), 2000);
    } finally {
      setLoading(false);
    }
  };
  // Handler para mudança do input principal
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handler para remover imagem
  const handleRemoveImage = (idx) => {
    setSelectedImages(prev => {
      URL.revokeObjectURL(prev[idx].previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  };

  // Estado para classificação
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [classResult, setClassResult] = useState(null);
  const [classLoading, setClassLoading] = useState(false);

  // Função para classificar atendimento
  const classificarAtendimento = async () => {
    setClassModalOpen(true);
    setClassLoading(true);
    setClassResult(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/classify_case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: messages })
      });
      if (!response.ok) throw new Error('Erro ao classificar atendimento.');
      const data = await response.json();
      setClassResult(data.classification);
    } catch (err) {
      setClassResult({ erro: err.message });
    } finally {
      setClassLoading(false);
    }
  };
  // Teste automático ao montar o componente
  // ...existing code...
  // Função para buscar resumo inteligente do backend
  const [modalOpen, setModalOpen] = useState(false);
  const [report, setReport] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const gerarResumoInteligente = async () => {
    setReportLoading(true);
    setModalOpen(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: messages, last_analysis: null })
      });
      if (!response.ok) throw new Error('Erro ao gerar resumo.');
      const data = await response.json();
      setReport(data.report);
    } catch (err) {
      setReport('Erro ao gerar resumo: ' + err.message);
    } finally {
      setReportLoading(false);
    }
  };
  // Função para gerar relatório em PDF
  const gerarRelatorio = () => {
    const doc = new jsPDF();
    let y = 15;
    doc.setFontSize(14);
    doc.text('Relatório do Atendimento - Aegis AI', 10, y);
    y += 10;
    doc.setFontSize(11);
    messages.forEach((msg) => {
      let texto = '';
      if (msg.type === 'image') {
        texto = `[${msg.who === 'user' ? 'Usuário' : 'Agente'}] Imagem enviada: (visualize no chat)`;
      } else {
        texto = `[${msg.who === 'user' ? 'Usuário' : 'Agente'}] ${msg.content}`;
      }
      // Quebra de linha automática se necessário
      const lines = doc.splitTextToSize(texto, 180);
      lines.forEach(line => {
        if (y > 280) { doc.addPage(); y = 15; }
        doc.text(line, 10, y);
        y += 7;
      });
    });
    doc.save('relatorio-atendimento-aegis.pdf');
  };
  const [extractModalOpen, setExtractModalOpen] = useState(false);
  const [extractResult, setExtractResult] = useState(null);
  const [extractLoading, setExtractLoading] = useState(false);

  // Função para extrair dados do orçamento
  const extrairDadosOrcamento = async () => {
    setExtractLoading(true);
    setExtractModalOpen(true);
    try {
      // Busca o último orçamento enviado pelo usuário
      let orcamento = '';
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].who === 'user' && messages[i].type === 'text' && messages[i].content.toLowerCase().includes('orçamento')) {
          orcamento = messages[i].content;
          break;
        }
      }
      if (!orcamento) {
        setExtractResult({ erro: 'Nenhum orçamento encontrado no histórico.' });
        return;
      }
      const response = await fetch('http://127.0.0.1:8000/extract_budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget: orcamento })
      });
      if (!response.ok) throw new Error('Erro ao extrair dados do orçamento.');
      const data = await response.json();
      setExtractResult(data.extracted);
    } catch (err) {
      setExtractResult({ erro: err.message });
    } finally {
      setExtractLoading(false);
    }
  };
  const [alert, setAlert] = useState({ message: '', type: '' });
  const defaultWelcome = { who: 'bot', content: 'Olá! Eu sou o Aegis AI – Vehicle Claims Agent. Envie a imagem do veículo e o orçamento da oficina para uma análise detalhada. 😉', type: 'text' };
  const [selectedImages, setSelectedImages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Handler para mudança de imagem
  const handleImageChange = (e) => {
  const files = Array.from(e.target.files);

  const mapped = files.map(file => ({
    file,
    previewUrl: URL.createObjectURL(file)
  }));

  setSelectedImages(prev => [
    ...prev,
    ...mapped.filter(
      m => !prev.some(p => p.file.name === m.file.name && p.file.size === m.file.size)
    )
  ]);
};

  // ...restante do return correto já foi ajustado anteriormente...
  return (
    <div className="app" style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', background: 'linear-gradient(135deg, #10182b 0%, #232946 100%)' }}>
      {/* Botões fixos no topo direito */}
      <div style={{ position: 'fixed', top: 32, right: 48, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16, zIndex: 2000 }}>
        <button
          onClick={() => {
            setMessages([]);
            localStorage.removeItem('aegis-chat');
          }}
          style={{
            background: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 18px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 12px 0 rgba(231,76,60,0.10)',
            minWidth: 200,
            textAlign: 'left',
            marginBottom: 8
          }}
        >
          🗑️ Limpar conversa
        </button>
        <button onClick={gerarRelatorio} style={{ background: '#2a61ff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 12px 0 rgba(42,97,255,0.10)', minWidth: 200, textAlign: 'left' }}>
          📄 Baixar Relatório
        </button>
        <button onClick={gerarResumoInteligente} style={{ background: '#00b894', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 12px 0 rgba(0,184,148,0.10)', minWidth: 200, textAlign: 'left' }}>
          🤖 Resumo Inteligente
        </button>
        <button onClick={classificarAtendimento} style={{ background: '#0984e3', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 12px 0 rgba(9,132,227,0.10)', minWidth: 200, textAlign: 'left' }}>
          🏷️ Classificar Atendimento
        </button>
        <button onClick={extrairDadosOrcamento} style={{ background: '#fdcb6e', color: '#222', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 12px 0 rgba(253,203,110,0.10)', minWidth: 200, textAlign: 'left' }}>
          💸 Extrair Dados do Orçamento
        </button>
      </div>

      <Modal open={extractModalOpen} onClose={() => setExtractModalOpen(false)}>
        <h3 style={{ marginTop: 0 }}>Dados Estruturados do Orçamento</h3>
        {extractLoading ? <div>Extraindo dados...</div> :
          extractResult ? <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{JSON.stringify(extractResult, null, 2)}</pre>
          : null}
      </Modal>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 style={{ marginTop: 0 }}>Resumo Inteligente do Atendimento</h3>
        {reportLoading ? <div>Gerando resumo...</div> : <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{report}</pre>}
      </Modal>
      <Modal open={classModalOpen} onClose={() => setClassModalOpen(false)}>
        <h3 style={{ marginTop: 0 }}>Classificação do Atendimento</h3>
        {classLoading ? <div>Classificando...</div> :
          classResult ? <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{JSON.stringify(classResult, null, 2)}</pre>
          : null}
      </Modal>
      <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
      <div style={{ width: '100%', maxWidth: 600, height: 'calc(100vh - 120px)', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(20,24,40,0.98)', borderRadius: 18, boxShadow: '0 4px 32px 0 rgba(42,97,255,0.10)', padding: '32px 24px 32px 24px', position: 'relative' }}>
        <header className="header" style={{ width: '100%', marginBottom: 10 }}>
          <div className="title" style={{ fontSize: 22, fontWeight: 700, color: '#2a61ff', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span role="img" aria-label="shield">🛡️</span> Aegis AI – Vehicle Claims Agent
          </div>
          <div className="subtitle" style={{ fontSize: 15, opacity: 0.85, marginTop: 6, color: '#b0b8d1' }}>Envie uma foto do veículo e o orçamento para análise inteligente</div>
          {/* Mensagem de boas-vindas removida */}
        </header>
        <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: 0, alignItems: 'center' }}>
          <Chat messages={messages} loading={loading} />
        </div>
      </div>
      {/* Painel de input fixo na parte inferior */}
      <div style={{ width: '100%', maxWidth: 600, position: 'fixed', left: '50%', bottom: 0, transform: 'translateX(-50%)', background: 'rgba(20,24,40,0.98)', boxShadow: '0 -2px 24px 0 rgba(42,97,255,0.10)', padding: '18px 24px 18px 24px', zIndex: 1500, borderTopLeftRadius: 18, borderTopRightRadius: 18, border: '1.5px solid #2a3a68' }}>
        <InputPanel
          onImageChange={handleImageChange}
          onInputChange={handleInputChange}
          onSend={handleSend}
          inputValue={inputValue}
          loading={loading}
          images={selectedImages}
          onRemoveImage={handleRemoveImage}
        />
      </div>
    </div>
  );
}

export default App;
