import { AlignLeft, Download, Quote } from 'lucide-react';

export default function ReviewWorkspacePage() {
  return (
    <div className="review-workspace">
      <div className="review-header">
        <h1 style={{ fontSize: '2rem' }}>Literature Review Workspace</h1>
        <div className="header-actions">
          <button className="btn-secondary"><Quote size={18} /> Citation Manager</button>
          <button className="btn-primary"><Download size={18} /> Export</button>
        </div>
      </div>

      <div className="workspace-container">
        <div className="editor-pane glass-panel">
          <div className="editor-toolbar">
            <button className="icon-btn"><AlignLeft size={18} /></button>
            <span className="divider"></span>
            <select className="style-select">
              <option>Heading 1</option>
              <option>Heading 2</option>
              <option>Paragraph</option>
            </select>
          </div>
          <div className="editor-content" contentEditable suppressContentEditableWarning>
            <h2>1. Introduction</h2>
            <p>Recent studies have explored transformer-based approaches in various domains <span className="inline-citation" contentEditable={false}>[Vaswani et al., 2017]</span>. However, there remains a significant challenge regarding compute scalability <span className="inline-citation" contentEditable={false}>[Devlin et al., 2019]</span>.</p>
            <br />
            <h2>2. Methodological Trends</h2>
            <p>Write your synthesis here, or use the AI Assistant to generate evidence-backed paragraphs...</p>
          </div>
        </div>

        <div className="assistant-pane glass-panel">
          <div className="pane-header">
            <h3>AI Assistant</h3>
          </div>
          <div className="chat-history">
            <div className="chat-message assistant">
              <p>How can I help you write your literature review?</p>
            </div>
            <div className="chat-message user">
              <p>Summarize the common limitations found in the "Attention Is All You Need" and "BERT" papers.</p>
            </div>
            <div className="chat-message assistant">
              <p>Both papers identify computational complexity as a primary limitation. Vaswani et al. notes quadratic scaling with sequence length, while Devlin et al. highlights the expense of pre-training bidirectional models.</p>
              <button className="insert-btn">+ Insert into Document</button>
            </div>
          </div>
          <div className="chat-input-area">
            <input type="text" placeholder="Ask AI to synthesize findings..." className="chat-input" />
            <button className="btn-primary" style={{ padding: '0.5rem' }}>Send</button>
          </div>
        </div>
      </div>

      <style>{`
        .review-workspace {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 120px);
        }
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .header-actions {
          display: flex;
          gap: 1rem;
        }
        .workspace-container {
          display: flex;
          gap: 1.5rem;
          flex: 1;
          overflow: hidden;
        }
        .editor-pane {
          flex: 2;
          display: flex;
          flex-direction: column;
        }
        .editor-toolbar {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-secondary);
          border-radius: var(--radius-md) var(--radius-md) 0 0;
        }
        .divider {
          width: 1px;
          height: 20px;
          background: var(--border-color);
          margin: 0 0.5rem;
        }
        .style-select {
          background: transparent;
          border: none;
          color: var(--text-primary);
          outline: none;
          font-family: inherit;
        }
        .editor-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          outline: none;
          line-height: 1.6;
        }
        .editor-content h2 {
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        .editor-content p {
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }
        .inline-citation {
          background: rgba(59, 130, 246, 0.15);
          color: var(--accent-primary);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          font-size: 0.9em;
          cursor: pointer;
        }
        .inline-citation:hover {
          background: rgba(59, 130, 246, 0.25);
        }
        
        .assistant-pane {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .pane-header {
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-secondary);
          border-radius: var(--radius-md) var(--radius-md) 0 0;
        }
        .chat-history {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .chat-message {
          padding: 1rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .chat-message.assistant {
          background: rgba(59, 130, 246, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.1);
        }
        .chat-message.user {
          background: var(--bg-tertiary);
          align-self: flex-end;
        }
        .insert-btn {
          margin-top: 0.75rem;
          font-size: 0.8rem;
          color: var(--accent-primary);
          background: transparent;
          border: 1px solid var(--accent-primary);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
        }
        .insert-btn:hover {
          background: var(--accent-primary);
          color: white;
        }
        .chat-input-area {
          padding: 1rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          gap: 0.5rem;
        }
        .chat-input {
          flex: 1;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          color: var(--text-primary);
          outline: none;
        }
        .chat-input:focus {
          border-color: var(--accent-primary);
        }
      `}</style>
    </div>
  );
}
