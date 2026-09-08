"use client";

import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your AI Research Assistant. You can ask me questions about any of the papers in your library.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const currentInput = input;
    setMessages(prev => [...prev, { role: 'user', text: currentInput }]);
    setInput('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput, history: messages })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error: ' + data.error }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I failed to reach the server. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-view">
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Global AI Assistant</h1>
      
      <div className="chat-container glass-panel">
        <div className="messages-area">
          {messages.map((msg, i) => (
             <div key={i} className={`message-row ${msg.role}`}>
               <div className="avatar">
                 {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
               </div>
               <div className={`message-bubble ${msg.role === 'assistant' ? 'markdown-body' : ''}`} style={msg.role === 'user' ? { whiteSpace: 'pre-wrap' } : {}}>
                 {msg.role === 'assistant' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
               </div>
             </div>
          ))}
          {loading && (
             <div className="message-row assistant">
               <div className="avatar">
                 <Bot size={20} />
               </div>
               <div className="message-bubble loading-dots">
                 <span>.</span><span>.</span><span>.</span>
               </div>
             </div>
          )}
        </div>
        
        <div className="input-area">
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Ask a question about your literature..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="btn-primary" onClick={handleSend} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            <Send size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .chat-view { display: flex; flex-direction: column; height: calc(100vh - 120px); }
        .chat-container { display: flex; flex-direction: column; flex: 1; overflow: hidden; border-radius: var(--radius-lg); }
        .messages-area { flex: 1; overflow-y: auto; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .message-row { display: flex; gap: 1rem; align-items: flex-start; max-width: 80%; }
        .message-row.user { align-self: flex-end; flex-direction: row-reverse; }
        .avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .message-row.assistant .avatar { background: rgba(139, 92, 246, 0.2); color: var(--accent-primary); }
        .message-row.user .avatar { background: var(--bg-tertiary); color: var(--text-secondary); }
        .message-bubble { padding: 1rem 1.25rem; border-radius: var(--radius-md); line-height: 1.5; }
        .message-row.assistant .message-bubble { background: rgba(139, 92, 246, 0.05); border: 1px solid rgba(139, 92, 246, 0.1); color: var(--text-primary); }
        .message-row.user .message-bubble { background: var(--bg-tertiary); color: var(--text-primary); }
        .input-area { padding: 1rem; border-top: 1px solid var(--border-color); display: flex; gap: 1rem; background: var(--bg-secondary); }
        .chat-input { flex: 1; background: var(--bg-primary); border: 1px solid var(--border-color); padding: 0.75rem 1rem; border-radius: var(--radius-md); color: var(--text-primary); outline: none; }
        .chat-input:focus { border-color: var(--accent-primary); }
        .loading-dots span { animation: blink 1.4s infinite both; font-weight: bold; font-size: 1.2rem; }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }
        
        .markdown-body { font-size: 0.95rem; line-height: 1.6; }
        .markdown-body p { margin-bottom: 1rem; }
        .markdown-body p:last-child { margin-bottom: 0; }
        .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 { margin-top: 1.5rem; margin-bottom: 0.75rem; font-weight: 600; color: var(--accent-primary); }
        .markdown-body h1:first-child, .markdown-body h2:first-child, .markdown-body h3:first-child, .markdown-body h4:first-child { margin-top: 0; }
        .markdown-body ul, .markdown-body ol { margin-left: 1.5rem; margin-bottom: 1rem; }
        .markdown-body li { margin-bottom: 0.25rem; }
        .markdown-body strong { font-weight: 600; color: var(--text-primary); }
        .markdown-body code { background: rgba(0,0,0,0.2); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; }
        .markdown-body pre { background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 6px; overflow-x: auto; margin-bottom: 1rem; }
        .markdown-body pre code { background: transparent; padding: 0; }
      `}</style>
    </div>
  );
}
