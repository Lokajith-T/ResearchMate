"use client";

import { useState, useEffect } from 'react';
import { Layers, Loader2 } from 'lucide-react';

export default function ComparePage() {
  const [papers, setPapers] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [matrix, setMatrix] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/papers').then(res => res.json()).then(data => {
      if (data.success) setPapers(data.papers);
    });
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleCompare = async () => {
    if (selectedIds.length < 2) {
      alert('Please select at least 2 papers.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperIds: selectedIds })
      });
      const data = await res.json();
      if (data.success) {
        setMatrix(data.comparisonMatrix);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate comparison.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="compare-view">
      <div className="compare-header">
        <h1 style={{ fontSize: '2rem' }}>Compare Papers</h1>
        <div className="compare-actions">
          {matrix.length > 0 && <button className="btn-secondary">Export Matrix</button>}
          {matrix.length > 0 && <button className="btn-primary">Save Comparison</button>}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Select 2 to 10 papers from your library to generate an evidence-backed comparison matrix.
        </p>
        
        <div className="paper-selection-list">
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
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>({p.year})</span>
              </label>
            ))
          )}
        </div>

        <button 
          className="btn-primary" 
          style={{ marginTop: '1rem' }} 
          onClick={handleCompare}
          disabled={selectedIds.length < 2 || loading}
        >
          {loading ? <Loader2 size={18} className="spin" /> : <Layers size={18} />}
          {loading ? 'Generating Matrix...' : 'Generate Comparison'}
        </button>
      </div>

      {matrix.length > 0 && (
        <div className="comparison-table-container">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Paper Title</th>
                <th>Methodology</th>
                <th>Research Problem</th>
                <th>Dataset</th>
                <th>Limitations</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row: any) => (
                <tr key={row.id}>
                  <td className="highlight-cell">{row.title}</td>
                  <td>{row.methodology}</td>
                  <td>{row.problem}</td>
                  <td>{row.dataset || 'Not extracted'}</td>
                  <td>{row.limitations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .compare-view { display: flex; flex-direction: column; }
        .compare-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .compare-actions { display: flex; gap: 1rem; }
        .paper-selection-list { display: flex; flex-direction: column; gap: 0.5rem; max-height: 200px; overflow-y: auto; background: var(--bg-tertiary); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); }
        .paper-checkbox-item { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.25rem 0; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .comparison-table-container { overflow-x: auto; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); }
        .comparison-table { width: 100%; border-collapse: collapse; text-align: left; }
        .comparison-table th { background: var(--bg-secondary); padding: 1rem; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border-color); }
        .comparison-table td { padding: 1rem; border-bottom: 1px solid var(--border-color); color: var(--text-primary); vertical-align: top; }
        .comparison-table tr:last-child td { border-bottom: none; }
        .highlight-cell { font-weight: 500; color: var(--accent-primary); }
      `}</style>
    </div>
  );
}
