import Link from 'next/link';
import { Home, Search, Library, Layers, FileText, LibraryBig, MessageSquare, Settings } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/" className="logo gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>ResearchMate</Link>
        </div>
        <nav className="sidebar-nav">
          <Link href="/dashboard" className="nav-item active"><Home size={20} /> Dashboard</Link>
          <Link href="/dashboard/search" className="nav-item"><Search size={20} /> Search Papers</Link>
          <Link href="/dashboard/library" className="nav-item"><Library size={20} /> My Library</Link>
          <div className="nav-section">Analysis</div>
          <Link href="/dashboard/compare" className="nav-item"><Layers size={20} /> Compare</Link>
          <Link href="/dashboard/gaps" className="nav-item"><FileText size={20} /> Gap Explorer</Link>
          <Link href="/dashboard/collections" className="nav-item"><LibraryBig size={20} /> Collections</Link>
          <div className="nav-section">AI Tools</div>
          <Link href="/dashboard/chat" className="nav-item"><MessageSquare size={20} /> AI Assistant</Link>
        </nav>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="user-profile">
            <div className="avatar">JD</div>
            <span>Dr. Jane Doe</span>
          </div>
        </header>
        <div className="content-area">
          {children}
        </div>
      </main>

      <style>{`
        .dashboard-container {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }
        .sidebar {
          width: 260px;
          background-color: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
        }
        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        .sidebar-nav {
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          overflow-y: auto;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
        .nav-item:hover, .nav-item.active {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }
        .nav-item.active {
          color: var(--accent-primary);
          background-color: rgba(59, 130, 246, 0.1);
        }
        .nav-section {
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          padding-left: 1rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-primary);
        }
        .topbar {
          height: 64px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 0 2rem;
          background-color: var(--bg-secondary);
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
        }
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }
        .content-area {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
