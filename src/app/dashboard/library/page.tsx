"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Filter, Plus, FileText, MoreVertical, Loader2, Trash2, Edit2 } from 'lucide-react';
import Link from 'next/link';

export default function LibraryPage() {
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchPapers = async () => {
    try {
      const res = await fetch('/api/papers');
      const data = await res.json();
      if (data.success) {
        setPapers(data.papers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/papers/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        alert('Paper uploaded successfully!');
        fetchPapers(); // refresh list
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err) {
      alert('An error occurred during upload.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async (id: string) => {
    setAnalyzingId(id);
    try {
      const res = await fetch(`/api/papers/${id}/analyze`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Analysis complete!');
        fetchPapers(); // refresh to show analysis status
      } else {
        alert('Analysis failed: ' + data.error);
      }
    } catch (err) {
      alert('An error occurred during analysis.');
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this paper?')) return;
    try {
      const res = await fetch(`/api/papers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchPapers(); // refresh list
      } else {
        alert('Delete failed: ' + data.error);
      }
    } catch (err) {
      alert('An error occurred during deletion.');
    }
  };

  const handleRename = async (id: string, currentTitle: string) => {
    setActiveDropdown(null);
    const newTitle = prompt('Enter a new title for this paper:', currentTitle);
    if (!newTitle || newTitle.trim() === '' || newTitle === currentTitle) return;

    try {
      const res = await fetch(`/api/papers/${id}`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() })
      });
      const data = await res.json();
      if (data.success) {
        fetchPapers(); // refresh list
      } else {
        alert('Rename failed: ' + data.error);
      }
    } catch (err) {
      alert('An error occurred while renaming.');
    }
  };

  return (
    <div className="library-view">
      <div className="library-header">
        <h1 style={{ fontSize: '2rem' }}>My Library</h1>
        <input 
          type="file" 
          accept="application/pdf" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />
        <button className="btn-primary" onClick={handleUploadClick} disabled={uploading}>
          {uploading ? <Loader2 size={18} className="spin" /> : <Plus size={18} />} 
          {uploading ? 'Uploading...' : 'Upload Paper'}
        </button>
      </div>

      <div className="library-controls glass-panel">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input type="text" placeholder="Search title, authors, or keywords..." className="search-input" />
        </div>
        <div className="filter-controls">
          <button className="btn-secondary"><Filter size={18} /> Filter</button>
          <select className="sort-select">
            <option>Sort by: Date Added</option>
            <option>Sort by: Year (Newest)</option>
            <option>Sort by: Title</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading papers...</div>
      ) : papers.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <FileText size={48} color="var(--text-tertiary)" style={{ margin: '0 auto 1rem' }} />
          <h3>Your library is empty</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Upload your first research paper to get started.</p>
        </div>
      ) : (
        <div className="papers-grid">
          {papers.map(paper => (
            <div key={paper.id} className="glass-panel paper-card">
              <div className="paper-card-header">
                <div className="paper-type">PDF Document</div>
                <div className="dropdown-container" style={{ position: 'relative' }}>
                  <button 
                    className="icon-btn" 
                    onClick={() => setActiveDropdown(activeDropdown === paper.id ? null : paper.id)}
                  >
                    <MoreVertical size={18} />
                  </button>
                  {activeDropdown === paper.id && (
                    <div className="dropdown-menu">
                      <button className="dropdown-item" onClick={() => handleRename(paper.id, paper.title)}>
                        <Edit2 size={16} /> Rename Paper
                      </button>
                      <button className="dropdown-item text-danger" onClick={() => handleDelete(paper.id)}>
                        <Trash2 size={16} /> Delete Paper
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="paper-title" title={paper.title}>{paper.title}</h3>
              <p className="paper-authors">{paper.authors?.join(', ')}</p>
              <div className="paper-meta">
                <span>{paper.year}</span>
                {paper.analysis && <span className="analyzed-badge">Analyzed</span>}
              </div>
              <div className="paper-actions">
                {paper.analysis ? (
                  <Link href={`/dashboard/library/${paper.id}`} className="btn-primary flex-1" style={{ textAlign: 'center', textDecoration: 'none' }}>
                    View Report
                  </Link>
                ) : (
                  <button 
                    className="btn-primary flex-1" 
                    onClick={() => handleAnalyze(paper.id)}
                    disabled={analyzingId === paper.id}
                  >
                    {analyzingId === paper.id ? 'Analyzing...' : 'Analyze'}
                  </button>
                )}
                <button className="btn-secondary flex-1" onClick={() => alert("Chat functionality coming soon!")}>Chat</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        /* Keep existing styles */
        .library-view { display: flex; flex-direction: column; gap: 2rem; }
        .library-header { display: flex; justify-content: space-between; align-items: center; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .library-controls { display: flex; justify-content: space-between; align-items: center; padding: 1rem; gap: 1rem; flex-wrap: wrap; }
        .search-bar { flex: 1; min-width: 300px; position: relative; display: flex; align-items: center; }
        .search-icon { position: absolute; left: 1rem; color: var(--text-secondary); }
        .search-input { width: 100%; padding: 0.75rem 1rem 0.75rem 3rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); font-family: inherit; }
        .search-input:focus { outline: none; border-color: var(--accent-primary); }
        .filter-controls { display: flex; gap: 1rem; }
        .sort-select { background: var(--bg-primary); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-family: inherit; }
        .papers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .paper-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; transition: transform var(--transition-fast), box-shadow var(--transition-fast); }
        .paper-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--border-focus); }
        .paper-card-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .paper-type { font-size: 0.75rem; padding: 0.25rem 0.5rem; background: var(--bg-tertiary); border-radius: var(--radius-sm); color: var(--text-secondary); }
        .icon-btn { color: var(--text-secondary); padding: 0.25rem; border-radius: var(--radius-sm); border: none; background: transparent; cursor: pointer; }
        .icon-btn:hover { background: var(--bg-tertiary); color: var(--text-primary); }
        .paper-title { font-size: 1.1rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .paper-authors { font-size: 0.9rem; color: var(--accent-secondary); }
        .paper-meta { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.5rem; }
        .analyzed-badge { font-size: 0.7rem; background: rgba(16, 185, 129, 0.1); color: var(--accent-success); padding: 0.15rem 0.4rem; border-radius: 4px; }
        .paper-actions { display: flex; gap: 0.75rem; margin-top: auto; }
        .flex-1 { flex: 1; }
        .dropdown-menu { position: absolute; right: 0; top: 100%; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); padding: 0.5rem; z-index: 10; min-width: 160px; margin-top: 0.25rem; }
        .dropdown-item { display: flex; align-items: center; gap: 0.5rem; width: 100%; padding: 0.5rem; border: none; background: transparent; color: var(--text-primary); cursor: pointer; border-radius: var(--radius-sm); font-size: 0.9rem; transition: background var(--transition-fast); }
        .dropdown-item:hover { background: var(--bg-tertiary); }
        .text-danger { color: #ef4444; }
        .text-danger:hover { background: rgba(239, 68, 68, 0.1); }
      `}</style>
    </div>
  );
}
