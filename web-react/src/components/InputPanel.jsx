
import React, { useRef } from "react";
import ImagePreview from "./ImagePreview";

export default function InputPanel({
  onImageChange,
  onInputChange,
  onSend,
  inputValue,
  loading,
  images = [],
  onRemoveImage
}) {
  const fileInputRef = useRef();

  return (
    <section className="panel">
      {/* Prévia das imagens anexadas */}
      {images.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <ImagePreview images={images} onRemove={onRemoveImage} />
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <label
          className="field attach-btn"
          htmlFor="imageInput"
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", margin: 0 }}
        >
          <span style={{ fontSize: 18, display: "flex", alignItems: "center" }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" style={{ verticalAlign: "middle" }}>
              <path d="M15.5 10.5L8.5 17.5C6.84315 19.1569 4.15685 19.1569 2.5 17.5C0.843146 15.8431 0.843146 13.1569 2.5 11.5L12.5 1.5C13.3284 0.671573 14.6716 0.671573 15.5 1.5C16.3284 2.32843 16.3284 3.67157 15.5 4.5L5.5 14.5C5.22386 14.7761 5.22386 15.2239 5.5 15.5C5.77614 15.7761 6.22386 15.7761 6.5 15.5L15 7" stroke="#2a61ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ marginLeft: 8, fontSize: 14, color: "#b0b8d1" }}>Anexar imagem</span>
          </span>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={e => {
              onImageChange(e);
              // Limpa o valor do input para permitir anexar o mesmo arquivo novamente
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          />
        </label>
      </div>
      <label className="field" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#181e2e', borderRadius: 12, border: '2px solid #2a61ff', padding: '0 12px', boxShadow: '0 2px 8px 0 rgba(42,97,255,0.06)' }}>
          <span style={{ color: '#2a61ff', fontSize: 22, marginRight: 8, display: 'flex', alignItems: 'center' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M2 12h20M2 12l7-7m-7 7l7 7" stroke="#2a61ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <textarea
            id="mainInput"
            placeholder="Digite sua pergunta ou cole o orçamento da oficina..."
            value={inputValue}
            onChange={onInputChange}
            disabled={loading}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#e6e6e6',
              fontSize: 17,
              padding: '14px 0',
              fontWeight: 500,
              resize: 'none',
              minHeight: 36,
              maxHeight: 120
            }}
            rows={1}
            onPaste={e => {
              if (onInputChange) onInputChange(e);
            }}
          />
        </div>
      </label>
      <button
        onClick={onSend}
        disabled={loading}
        style={{
          width: '100%',
          marginTop: 12,
          background: 'linear-gradient(90deg, #2a61ff 60%, #00b894 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          padding: '14px 0',
          fontWeight: 700,
          fontSize: 17,
          boxShadow: '0 2px 12px 0 rgba(42,97,255,0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'background 0.2s, opacity 0.2s'
        }}
      >
        <span style={{ fontSize: 20, display: 'flex', alignItems: 'center' }}>
          {loading ? '⏳' : '🔍'}
        </span>
        {loading ? 'Aguarde...' : 'Analisar/Perguntar'}
      </button>
    </section>
  );
}
