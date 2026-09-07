"use client";

import { useState, useEffect } from 'react';
import { Search as SearchIcon, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/papers').then(res => res.json()).then(data => {
      if (data.success) setPapers(data.papers);
      setLoading(false);
    });
  }, []);

  const filteredPapers = papers.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) || 
    (p.authors && p.authors.join(' ').toLowerCase().includes(query.toLowerCase())) ||
    (p.abstract && p.abstract.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="search-view">
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Search Library</h1>

      <div className="search-container glass-panel">
        <SearchIcon size={24} className="search-icon" />
        <input 
          type="text" 
          className="search-input-large"
          placeholder="Search across titles, authors, and abstracts..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div className="search-results">
        {loading ? (
           <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        ) : query.length > 0 && filteredPapers.length === 0 ? (
           <p style={{ color: 'var(--text-secondary)' }}>No results found for "{query}"</p>
        ) : (
           <div className="results-list">
             {filteredPapers.map(paper => (
               <div key={paper.id} className="result-item glass-panel">
                 <div className="result-info">
                   <h3>{paper.title}</h3>
                   <p className="authors">{paper.authors?.join(', ')} • {paper.year}</p>
                   {paper.abstract && <p className="abstract">{paper.abstract.substring(0, 150)}...</p>}
                 </div>
                 <Link href={`/dashboard/library`} className="btn-secondary">View <ArrowRight size={16} style={{marginLeft: '0.5rem'}} /></Link>
               </div>
             ))}
           </div>
        )}
      </div>

      <style>{`
        .search-view { display: flex; flex-direction: column; }
        .search-container { display: flex; align-items: center; padding: 1rem 1.5rem; border-radius: var(--radius-lg); margin-bottom: 2rem; }
        .search-icon { color: var(--text-tertiary); margin-right: 1rem; }
        .search-input-large { flex: 1; background: transparent; border: none; color: var(--text-primary); font-size: 1.1rem; outline: none; }
        .search-input-large::placeholder { color: var(--text-tertiary); }
        .results-list { display: flex; flex-direction: column; gap: 1rem; }
        .result-item { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; gap: 2rem; }
        .result-info h3 { margin-bottom: 0.5rem; color: var(--accent-secondary); }
        .authors { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem; }
        .abstract { font-size: 0.85rem; color: var(--text-tertiary); line-height: 1.5; }
      `}</style>
    </div>
  );
}
