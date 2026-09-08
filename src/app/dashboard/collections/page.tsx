"use client";

import { useState, useEffect } from 'react';
import { FolderOpen, Plus, MoreVertical } from 'lucide-react';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionTopic, setNewCollectionTopic] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchCollections = () => {
    setLoading(true);
    fetch('/api/collections').then(res => res.json()).then(data => {
      if (data.success) setCollections(data.collections);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleCreate = async () => {
    if (!newCollectionName || !newCollectionTopic) return;
    setIsCreating(true);
    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCollectionName, topic: newCollectionTopic })
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setNewCollectionName('');
        setNewCollectionTopic('');
        fetchCollections();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to create collection');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="collections-view">
      <div className="collections-header">
        <h1 style={{ fontSize: '2rem' }}>My Collections</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={18} /> New Collection</button>
      </div>

      <div className="collections-grid">
        {loading ? (
           <p style={{ color: 'var(--text-tertiary)', gridColumn: '1 / -1' }}>Loading collections...</p>
        ) : collections.length === 0 ? (
           <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', gridColumn: '1 / -1' }}>No collections found.</p>
        ) : (
          collections.map(collection => (
            <div key={collection.id} className="glass-panel collection-card">
              <div className="collection-header">
                <div className="icon-wrapper">
                  <FolderOpen size={24} color="var(--accent-primary)" />
                </div>
                <button className="icon-btn"><MoreVertical size={18} /></button>
              </div>
              
              <h2 className="collection-name">{collection.name}</h2>
              <div className="collection-topic">{collection.topic}</div>
              
              <div className="collection-footer">
                <span className="paper-count">{collection.paperIds?.length || 0} papers</span>
                <span className="last-updated">Updated recently</span>
              </div>

              <div className="collection-actions">
                <button className="btn-secondary" style={{ flex: 1, fontSize: '0.85rem' }}>View Papers</button>
                <button className="btn-primary" style={{ flex: 1, fontSize: '0.85rem' }}>Find Gaps</button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h2>Create New Collection</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Organize your research papers by theme or project.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Collection Name</label>
                <input 
                  type="text" 
                  className="modal-input" 
                  placeholder="e.g., Transformer Architectures"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Topic / Theme</label>
                <input 
                  type="text" 
                  className="modal-input" 
                  placeholder="e.g., Deep Learning"
                  value={newCollectionTopic}
                  onChange={(e) => setNewCollectionTopic(e.target.value)}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button 
                className="btn-primary" 
                onClick={handleCreate}
                disabled={!newCollectionName || !newCollectionTopic || isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Collection'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .collections-view { display: flex; flex-direction: column; gap: 2rem; }
        .collections-header { display: flex; justify-content: space-between; align-items: center; }
        .collections-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .collection-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; transition: transform var(--transition-fast), box-shadow var(--transition-fast); }
        .collection-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--border-focus); }
        .collection-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .icon-wrapper { padding: 0.75rem; background: rgba(59, 130, 246, 0.1); border-radius: var(--radius-md); }
        .icon-btn { color: var(--text-secondary); padding: 0.25rem; border-radius: var(--radius-sm); border: none; background: transparent; cursor: pointer; }
        .icon-btn:hover { background: var(--bg-tertiary); color: var(--text-primary); }
        .collection-name { font-size: 1.25rem; margin-top: 0.5rem; }
        .collection-topic { font-size: 0.9rem; color: var(--text-secondary); background: var(--bg-tertiary); padding: 0.25rem 0.75rem; border-radius: var(--radius-full); width: fit-content; }
        .collection-footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--text-tertiary); margin-top: 0.5rem; }
        .collection-actions { display: flex; gap: 0.75rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color); }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { width: 100%; max-width: 450px; padding: 2rem; border-radius: var(--radius-lg); background: var(--bg-primary); }
        .modal-input { width: 100%; background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 0.75rem 1rem; border-radius: var(--radius-md); color: var(--text-primary); outline: none; transition: border-color var(--transition-fast); }
        .modal-input:focus { border-color: var(--accent-primary); }
      `}</style>
    </div>
  );
}
