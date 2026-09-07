"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, CheckCircle2, List, Settings, Target, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PaperDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [paper, setPaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetch('/api/papers').then(res => res.json()).then(data => {
      if (data.success) {
        const found = data.papers.find((p: any) => p.id === id);
        setPaper(found);
      }
      setLoading(false);
    });
  }, [id]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch(`/api/papers/${id}/analyze`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setPaper({ ...paper, analysis: data.analysis });
      } else {
        alert('Analysis failed: ' + data.error);
      }
    } catch (err) {
      alert('An error occurred during analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading report...</div>;
  if (!paper) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Paper not found.</div>;

  const analysis = paper.analysis;

  const EvidenceCard = ({ title, icon, data }: { title: string, icon: React.ReactNode, data?: { summary: string, evidence: string } | string }) => {
    if (!data) return null;
    
    // Handle mock analysis fallback where data might be a simple string
    const summary = typeof data === 'string' ? data : data.summary;
    const evidence = typeof data === 'string' ? null : data.evidence;

    return (
      <div className="analysis-card glass-panel">
        <h2 className="card-title">{icon} {title}</h2>
        <div className="card-content">
          <p>{summary}</p>
          {evidence && evidence !== "Not identified in the provided paper." && (
            <div className="evidence-box">
              <span className="evidence-label">Evidence / Quote:</span>
              <p className="evidence-text">"{evidence}"</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="paper-details-view">
      <Link href="/dashboard/library" className="back-link">
        <ArrowLeft size={16} /> Back to Library
      </Link>

      <div className="report-header glass-panel" style={{ position: 'relative' }}>
        <div className="header-actions" style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
          <button className="btn-secondary" onClick={handleAnalyze} disabled={analyzing} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={16} className={analyzing ? "spin" : ""} /> {analyzing ? 'Running AI...' : (analysis ? 'Re-Analyze' : 'Analyze')}
          </button>
        </div>
        <div className="paper-type">PDF Document</div>
        <h1 style={{ fontSize: '1.75rem', marginTop: '0.5rem', marginBottom: '0.5rem', paddingRight: '120px' }}>{paper.title}</h1>
        <p className="authors" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          {paper.authors?.join(', ')} • {paper.year}
        </p>
        
        {!analysis && !analyzing && (
          <div className="no-analysis">
             <p>This paper hasn't been analyzed yet. Click Analyze to extract insights using Gemini AI.</p>
          </div>
        )}
        {analyzing && (
          <div className="no-analysis">
             <p style={{ color: 'var(--accent-primary)' }}>Analyzing document... This may take up to 30 seconds for a full paper.</p>
          </div>
        )}
      </div>

      {analysis && (
        <div className="analysis-grid">
          <EvidenceCard title="Research Problem" icon={<FileText size={20} />} data={analysis.problem} />
          <EvidenceCard title="Objective" icon={<Target size={20} />} data={analysis.objective} />
          <EvidenceCard title="Methodology" icon={<Settings size={20} />} data={analysis.methodology} />
          <EvidenceCard title="Dataset Used" icon={<List size={20} />} data={analysis.dataset} />
          <EvidenceCard title="Key Results" icon={<CheckCircle2 size={20} className="text-success" />} data={analysis.results} />
          <EvidenceCard title="Limitations" icon={<AlertTriangle size={20} className="text-warning" />} data={analysis.limitations} />
          <EvidenceCard title="Future Work" icon={<Lightbulb size={20} className="text-accent" />} data={analysis.futureWork} />
        </div>
      )}

      <style>{`
        .paper-details-view { display: flex; flex-direction: column; gap: 1.5rem; }
        .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text-tertiary); text-decoration: none; font-size: 0.9rem; transition: color 0.2s; align-self: flex-start; }
        .back-link:hover { color: var(--text-primary); }
        
        .report-header { padding: 2rem; display: flex; flex-direction: column; }
        .paper-type { font-size: 0.75rem; padding: 0.25rem 0.5rem; background: var(--bg-tertiary); border-radius: var(--radius-sm); color: var(--text-secondary); align-self: flex-start; }
        
        .analysis-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        
        .analysis-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .card-title { font-size: 1.1rem; color: var(--accent-secondary); display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem; }
        .card-content { display: flex; flex-direction: column; gap: 1rem; color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem; }
        
        .evidence-box { background: rgba(59, 130, 246, 0.05); border-left: 3px solid var(--accent-primary); padding: 1rem; border-radius: 0 var(--radius-md) var(--radius-md) 0; }
        .evidence-label { font-size: 0.8rem; font-weight: 600; color: var(--accent-primary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; display: block; }
        .evidence-text { color: var(--text-primary); font-style: italic; font-size: 0.9rem; margin: 0; }
        
        .text-success { color: var(--accent-success); }
        .text-warning { color: #f59e0b; }
        .text-accent { color: var(--accent-primary); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
