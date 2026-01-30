import React from "react";

export default function ImagePreview({ images, onRemove }) {
  return (
    <div id="imagePreviewContainer">
      {images.map((img, idx) => (
        <div key={idx} style={{ position: 'relative', display: 'inline-block', marginRight: 8 }}>
          <img
            src={img.previewUrl}
            alt="Prévia da imagem"
            style={{ maxWidth: 80, maxHeight: 80, borderRadius: 10, border: '2px solid #2a61ff', background: '#151e36', objectFit: 'cover', boxShadow: '0 2px 8px 0 rgba(42,97,255,0.08)' }}
          />
          <button
            type="button"
            title="Remover imagem"
            style={{ position: 'absolute', top: -8, right: -8, background: '#2a61ff', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontWeight: 'bold', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => onRemove(idx)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
