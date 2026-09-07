"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [data, setData] = useState<any>({
    stats: { totalPapers: 0, totalCollections: 0, totalTopics: 0, totalGaps: 0 },
    recentPapers: [],
    recentGaps: []
  });

  useEffect(() => {
    fetch('/api/dashboard').then(res => res.json()).then(result => {
      if (result.success) setData(result);
    });
  }, []);

  return (
    <div className="dashboard-view">
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Overview</h1>
      
      <div className="metrics-grid">
        <div className="glass-panel metric-card">
          <h3>Total Papers</h3>
          <div className="metric-value">{data.stats.totalPapers}</div>
        </div>
        <div className="glass-panel metric-card">
          <h3>Collections</h3>
          <div className="metric-value">{data.stats.totalCollections}</div>
        </div>
        <div className="glass-panel metric-card">
          <h3>Research Topics</h3>
          <div className="metric-value">{data.stats.totalTopics}</div>
        </div>
        <div className="glass-panel metric-card">
          <h3>Gaps Identified</h3>
          <div className="metric-value accent">{data.stats.totalGaps}</div>
        </div>
      </div>

      <div className="dashboard-content">
        <section className="glass-panel section-panel" style={{ gridColumn: 'span 2' }}>
          <div className="section-header">
            <h2>Recent Papers</h2>
            <Link href="/dashboard/library" className="btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}>View All</Link>
          </div>
          <div className="paper-list">
            {data.recentPapers.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No papers uploaded yet.</p>
            ) : (
              data.recentPapers.map((paper: any) => (
                <div key={paper.id} className="paper-item">
                  <div className="paper-info">
                    <h4>{paper.title}</h4>
                    <p>{paper.authors?.join(', ')} • {paper.year}</p>
                  </div>
                  <Link href="/dashboard/library" className="btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>View</Link>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="glass-panel section-panel">
          <div className="section-header">
            <h2>Recent Gap Discoveries</h2>
          </div>
          <div className="gap-list">
             {data.recentGaps.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No gaps identified yet.</p>
            ) : (
              data.recentGaps.map((gap: any) => (
                <div key={gap.id} className="gap-item">
                  <h4>{gap.title}</h4>
                  <p>{gap.evidence}</p>
                  <div className={`confidence ${gap.confidence?.toLowerCase()}`}>{gap.confidence} Confidence</div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <style>{`
        .dashboard-view { display: flex; flex-direction: column; gap: 2rem; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
        .metric-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .metric-card h3 { font-size: 0.9rem; color: var(--text-secondary); font-weight: 500; }
        .metric-value { font-size: 2.5rem; font-weight: 700; }
        .metric-value.accent { color: var(--accent-primary); }
        .dashboard-content { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
        @media (max-width: 1024px) {
          .dashboard-content { grid-template-columns: 1fr; }
          .section-panel { grid-column: span 1 !important; }
        }
        .section-panel { padding: 1.5rem; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .section-header h2 { font-size: 1.25rem; }
        .paper-list { display: flex; flex-direction: column; gap: 1rem; }
        .paper-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); }
        .paper-info h4 { margin-bottom: 0.25rem; }
        .paper-info p { font-size: 0.85rem; color: var(--text-secondary); }
        .gap-list { display: flex; flex-direction: column; gap: 1rem; }
        .gap-item { padding: 1rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); display: flex; flex-direction: column; gap: 0.5rem; }
        .gap-item h4 { color: var(--accent-secondary); }
        .gap-item p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .confidence { font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); display: inline-block; width: fit-content; }
        .confidence.high { background: rgba(16, 185, 129, 0.1); color: var(--accent-success); }
        .confidence.medium { background: rgba(245, 158, 11, 0.1); color: var(--accent-warning); }
        .confidence.low { background: rgba(239, 68, 68, 0.1); color: var(--accent-danger); }
      `}</style>
    </div>
  );
}
