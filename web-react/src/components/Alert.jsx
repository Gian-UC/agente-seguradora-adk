import React from "react";

export default function Alert({ message, type, onClose }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 2000, display: 'flex', justifyContent: 'center', pointerEvents: 'none'
    }}>
      <div style={{
        marginTop: 24,
        background: type === 'error' ? '#ff7675' : '#00b894',
        color: '#fff',
        padding: '12px 32px',
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 16,
        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <span>{message}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', marginLeft: 8 }}>&times;</button>
      </div>
    </div>
  );
}
