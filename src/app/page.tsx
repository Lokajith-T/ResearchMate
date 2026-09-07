import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="logo gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>ResearchMate</div>
        <div className="nav-links">
          <Link href="/dashboard" className="btn-secondary">Login</Link>
          <Link href="/dashboard" className="btn-primary">Go to App</Link>
        </div>
      </nav>
      
      <main className="hero-section">
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', textAlign: 'center' }}>
          Your AI Research Companion
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '600px', marginBottom: '2rem' }}>
          Helps students search, summarize and organize research literature
        </p>
        
        <div className="action-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/dashboard/search" className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem' }}>
            Explore Papers
          </Link>
          <Link href="/dashboard/library" className="btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem' }}>
            My Library
          </Link>
        </div>

        <div className="features-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', marginTop: '4rem' }}>
          {['Research Paper Analysis', 'Multi-Paper Comparison', 'Research Gap Detection', 'Evidence-Grounded AI Chat', 'Literature Review Assistant', 'Citation Management'].map((feature) => (
            <div key={feature} className="glass-panel" style={{ padding: '1.5rem', width: '250px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>{feature}</h3>
            </div>
          ))}
        </div>
        
        <div className="workflow" style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-tertiary)', letterSpacing: '2px', fontSize: '0.9rem' }}>
          SEARCH → ANALYZE → COMPARE → FIND GAPS → RESEARCH
        </div>
      </main>
      
      <style>{`
        .landing-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border-color);
        }
        .nav-links {
          display: flex;
          gap: 1rem;
        }
        .hero-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          background: radial-gradient(circle at center top, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
        }
      `}</style>
    </div>
  );
}
