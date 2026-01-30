import React, { useRef, useEffect } from "react";

function Chat({ messages, loading }) {
  const chatRef = useRef();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <main
      className="chat"
      ref={chatRef}
      style={{
        width: '100%',
        flex: 1,
        maxHeight: '70vh',
        overflowY: 'auto',
        paddingRight: 8,
        paddingBottom: 20,
        marginBottom: 120,
        boxSizing: 'border-box',
      }}
    >
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`bubble ${msg.who}`}
          style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}
        >
          <span style={{ fontSize: 22, marginTop: msg.type === 'image' ? 8 : 2 }}>
            {msg.who === 'user' ? '🧑' : '🤖'}
          </span>
          <span style={{ flex: 1 }}>
            {msg.type === 'image' ? (
              <img
                src={msg.content}
                alt="Prévia"
                style={{
                  maxWidth: '100%',
                  maxHeight: 220,
                  borderRadius: 10,
                  display: 'block',
                  margin: '8px 0',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  lineHeight: 1.5,
                }}
              >
                {msg.content}
              </div>
            )}
          </span>
        </div>
      ))}

      {loading && (
        <div className="bubble bot" style={{ opacity: 0.7 }}>
          ⏳ Respondendo...
        </div>
      )}
    </main>
  );
}

export default Chat;
