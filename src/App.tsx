import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SessionPage from './pages/SessionPage';
import FleetComparisonPage from './pages/FleetComparisonPage';

function App() {
  return (
    <BrowserRouter>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a)',
        color: '#ffffff'
      }}>
        {/* Header */}
        <header style={{
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#fff' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(to bottom right, #38bdf8, #0284c7)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                <span>⛵</span>
              </div>
              <div>
                <h1 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(to right, #38bdf8, #0284c7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: 0
                }}>
                  RacePilot
                </h1>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Professional Race Analysis</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/session/:id" element={<SessionPage />} />
            <Route path="/fleet-comparison" element={<FleetComparisonPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer style={{ marginTop: '64px', padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
          <p>RacePilot Dashboard • Powered by Railway</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
