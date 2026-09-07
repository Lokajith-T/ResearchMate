"use client";

import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your AI Research Assistant. You can ask me questions about any of the papers in your library.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    const currentInput = input;
    setInput('');
    
    // Mock response for now
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: `I've checked your library. I noticed a few papers related to "${currentInput}". However, global AI chat over all papers is still under active development! Please check back soon.` 
      }]);
    }, 1000);
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
               <div className="message-bubble">
                 {msg.text}
               </div>
             </div>
          ))}
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
          <button className="btn-primary" onClick={handleSend}><Send size={18} /></button>
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
      `}</style>
    </div>
  );
}
