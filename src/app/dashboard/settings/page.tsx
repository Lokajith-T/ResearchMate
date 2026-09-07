"use client";

import { Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="settings-view">
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Settings</h1>

      <div className="settings-section glass-panel">
        <h2>API Configuration</h2>
        <p className="description">Manage your LLM provider keys for ResearchMate capabilities.</p>
        
        <div className="form-group">
          <label>Google Gemini API Key</label>
          <input type="password" placeholder="AIzaSy..." className="settings-input" defaultValue="AIzaSy***********************" />
        </div>
        
        <div className="form-group">
          <label>OpenAI API Key (Optional)</label>
          <input type="password" placeholder="sk-..." className="settings-input" />
        </div>
      </div>

      <div className="settings-section glass-panel">
        <h2>Preferences</h2>
        
        <div className="form-group checkbox-group">
          <label className="toggle-label">
            <input type="checkbox" defaultChecked />
            Enable Advanced AI Extraction (Slower but more accurate)
          </label>
        </div>
        
        <div className="form-group checkbox-group">
          <label className="toggle-label">
            <input type="checkbox" defaultChecked />
            Automatically tag uploaded papers
          </label>
        </div>
      </div>

      <button className="btn-primary" style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
        <Save size={18} style={{ marginRight: '0.5rem' }} /> Save Changes
      </button>

      <style>{`
        .settings-view { display: flex; flex-direction: column; gap: 2rem; max-width: 800px; }
        .settings-section { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .settings-section h2 { font-size: 1.25rem; color: var(--accent-secondary); }
        .description { color: var(--text-secondary); font-size: 0.9rem; margin-top: -1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.9rem; font-weight: 500; color: var(--text-primary); }
        .settings-input { background: var(--bg-primary); border: 1px solid var(--border-color); padding: 0.75rem 1rem; border-radius: var(--radius-md); color: var(--text-primary); outline: none; font-family: inherit; }
        .settings-input:focus { border-color: var(--accent-primary); }
        .checkbox-group { flex-direction: row; align-items: center; }
        .toggle-label { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; color: var(--text-secondary) !important; font-weight: 400 !important; }
      `}</style>
    </div>
  );
}
