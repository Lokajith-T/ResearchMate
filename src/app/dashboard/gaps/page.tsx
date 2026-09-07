"use client";

import { useState, useEffect } from 'react';
import { FileText, Loader2 } from 'lucide-react';

export default function GapExplorerPage() {
  const [papers, setPapers] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/papers').then(res => res.json()).then(data => {
      if (data.success) {
        setPapers(data.papers);
        setSelectedIds(data.papers.map((p: any) => p.id)); // Default to selecting all
      }
    });
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleDetectGaps = async () => {
    if (selectedIds.length < 2) {
      alert('Please select at least 2 papers for cross-paper analysis.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/research-gaps/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperIds: selectedIds })
      });
      const data = await res.json();
      if (data.success) {
        setGaps(data.gaps);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to detect research gaps.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gaps-view">
      <div className="gaps-header">
        <h1 style={{ fontSize: '2rem' }}>Research Gap Explorer</h1>
        <button 
          className="btn-primary" 
          onClick={handleDetectGaps}
          disabled={selectedIds.length < 2 || loading}
        >
          {loading ? <Loader2 size={18} className="spin" /> : <FileText size={18} />}
          {loading ? 'Detecting Gaps...' : 'Detect New Gaps'}
        </button>
      </div>

      <div className="glass-panel info-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          The AI analyzes multiple papers in your library to identify common limitations, missing datasets, underexplored populations, and methodological flaws.
        </p>
        <div className="paper-selection-list" style={{ marginTop: '1rem' }}>
          {papers.length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No papers in library yet.</p>
          ) : (
            papers.map(p => (
              <label key={p.id} className="paper-checkbox-item">
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(p.id)}
                  onChange={() => toggleSelection(p.id)}
                />
                <span style={{ fontWeight: 500 }}>{p.title}</span>
              </label>
            ))
          )}
        </div>
      </div>

      <div className="gaps-grid">
        {gaps.length === 0 && !loading && (
           <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '2rem' }}>
             Run detection to discover research gaps.
           </p>
        )}
        
        {gaps.map((gap, index) => (
          <div key={index} className="glass-panel gap-card">
            <div className="gap-card-header">
              <h2 className="gap-title">{gap.title}</h2>
              <span className={`confidence ${gap.confidence?.toLowerCase()}`}>{gap.confidence} Confidence</span>
            </div>
            
            <div className="gap-section">
              <h4>Evidence</h4>
              <p>{gap.evidence}</p>
            </div>

            <div className="gap-section ai-suggestion">
              <h4 className="gradient-text">AI-SUGGESTED RESEARCH DIRECTION</h4>
              <p>{gap.direction}</p>
            </div>

            <div className="supporting-papers">
              <strong>Supporting Literature:</strong> {gap.supportingPapers?.join(', ')}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .gaps-view { display: flex; flex-direction: column; }
        .gaps-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .paper-selection-list { display: flex; flex-direction: column; gap: 0.5rem; max-height: 150px; overflow-y: auto; background: var(--bg-tertiary); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); }
        .paper-checkbox-item { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.25rem 0; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .gaps-grid { display: flex; flex-direction: column; gap: 1.5rem; }
        .gap-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .gap-card-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .gap-title { font-size: 1.25rem; color: var(--text-primary); }
        .gap-section h4 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); margin-bottom: 0.5rem; }
        .gap-section p { color: var(--text-secondary); line-height: 1.5; }
        .ai-suggestion { background: rgba(139, 92, 246, 0.05); padding: 1rem; border-radius: var(--radius-md); border: 1px solid rgba(139, 92, 246, 0.2); }
        .supporting-papers { font-size: 0.85rem; color: var(--text-tertiary); padding-top: 1rem; border-top: 1px solid var(--border-color); }
        .confidence { font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); }
        .confidence.high { background: rgba(16, 185, 129, 0.1); color: var(--accent-success); }
        .confidence.medium { background: rgba(245, 158, 11, 0.1); color: var(--accent-warning); }
        .confidence.low { background: rgba(239, 68, 68, 0.1); color: var(--accent-danger); }
      `}</style>
    </div>
  );
}
