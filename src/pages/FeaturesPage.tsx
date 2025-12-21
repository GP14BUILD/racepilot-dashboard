import { Link } from 'react-router-dom';

export default function FeaturesPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        padding: '20px 40px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img
            src="https://raw.githubusercontent.com/GP14BUILD/racepilotimages/main/ChatGPT%20Image%20Nov%208%2C%202025%2C%2002_40_39%20PM.png"
            alt="RacePilot"
            style={{
              height: '48px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          <span style={{ color: '#60a5fa', fontSize: '20px', fontWeight: '700' }}>RacePilot</span>
        </Link>

        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/features" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>
            Features
          </Link>
          <Link to="/shop" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>
            Shop
          </Link>
          <Link to="/faq" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>
            FAQ
          </Link>
          <Link
            to="/login"
            style={{
              padding: '10px 20px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              color: '#60a5fa',
              fontSize: '15px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 24px 40px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '800',
          marginBottom: '20px',
          background: 'linear-gradient(to right, #ffffff, #60a5fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Advanced Features
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#94a3b8',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          Intelligent analytics that make you faster on the water
        </p>
      </section>

      {/* Features Grid */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px 80px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '32px'
        }}>

          {/* Automatic Maneuver Detection */}
          <div style={{
            padding: '40px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚡</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
              Automatic Maneuver Detection
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.8', marginBottom: '24px' }}>
              Our intelligent analytics system automatically detects and analyzes every tack, gybe, mark rounding, and start sequence in real-time. No manual tagging required.
            </p>
            <ul style={{ color: '#94a3b8', lineHeight: '2', listStyle: 'none', padding: 0 }}>
              <li>✓ Automatic tack detection with efficiency scoring</li>
              <li>✓ Gybe analysis and speed loss calculation</li>
              <li>✓ Mark rounding optimization</li>
              <li>✓ Start line performance metrics</li>
            </ul>
          </div>

          {/* Intelligent Coaching */}
          <div style={{
            padding: '40px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>💡</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
              Personalized Coaching Insights
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.8', marginBottom: '24px' }}>
              Get instant, actionable insights on your sailing performance. Like having an Olympic coach analyze every race.
            </p>
            <ul style={{ color: '#94a3b8', lineHeight: '2', listStyle: 'none', padding: 0 }}>
              <li>✓ Tack efficiency recommendations</li>
              <li>✓ Speed loss identification</li>
              <li>✓ Tactical error detection</li>
              <li>✓ Personalized improvement tips</li>
            </ul>
          </div>

          {/* Smart Wind Analysis */}
          <div style={{
            padding: '40px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>💨</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
              Smart Wind Analysis
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.8', marginBottom: '24px' }}>
              Automatically detect wind shifts, oscillations, and persistent patterns. Understand which side of the course paid off and why.
            </p>
            <ul style={{ color: '#94a3b8', lineHeight: '2', listStyle: 'none', padding: 0 }}>
              <li>✓ Automatic wind shift detection</li>
              <li>✓ Oscillation vs persistent shift analysis</li>
              <li>✓ Favored side identification</li>
              <li>✓ Velocity header/lift calculations</li>
            </ul>
          </div>

          {/* Fleet Comparison & Race Replay */}
          <div style={{
            padding: '40px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🗺️</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
              Fleet Comparison & Race Replay
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.8', marginBottom: '24px' }}>
              Compare multiple sailors side-by-side on the same map. Replay races to see exactly where you gained or lost positions.
            </p>
            <ul style={{ color: '#94a3b8', lineHeight: '2', listStyle: 'none', padding: 0 }}>
              <li>✓ Multi-track comparison on single map</li>
              <li>✓ Time-synchronized race replay</li>
              <li>✓ Speed and VMG comparison</li>
              <li>✓ Learn from the fastest boats</li>
            </ul>
          </div>

          {/* Real-time Wind Data */}
          <div style={{
            padding: '40px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌊</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
              Real-time Wind Data
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.8', marginBottom: '24px' }}>
              Connect Bluetooth wind sensors (like Calypso Ultrasonic) to capture real-time wind data during your races.
            </p>
            <ul style={{ color: '#94a3b8', lineHeight: '2', listStyle: 'none', padding: 0 }}>
              <li>✓ True Wind Angle (TWA)</li>
              <li>✓ True Wind Speed (TWS)</li>
              <li>✓ Apparent Wind Data</li>
              <li>✓ Post-race wind visualization</li>
            </ul>
          </div>

          {/* Club Integration */}
          <div style={{
            padding: '40px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏆</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
              Club Integration
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.8', marginBottom: '24px' }}>
              Seamless integration with your sailing club. Share sessions, compare with fleet mates, and track club-wide performance.
            </p>
            <ul style={{ color: '#94a3b8', lineHeight: '2', listStyle: 'none', padding: 0 }}>
              <li>✓ Club-based session sharing</li>
              <li>✓ Fleet performance tracking</li>
              <li>✓ Club leaderboards</li>
              <li>✓ Group analytics</li>
            </ul>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        maxWidth: '800px',
        margin: '0 auto 80px',
        padding: '60px 24px',
        textAlign: 'center',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '24px',
        border: '1px solid rgba(59, 130, 246, 0.3)'
      }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '20px' }}>
          Ready to Get Faster?
        </h2>
        <p style={{ fontSize: '18px', color: '#cbd5e1', marginBottom: '32px' }}>
          Start using RacePilot's AI-powered analytics today
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/shop"
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '18px',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)',
              display: 'inline-block'
            }}
          >
            View Hardware Packages
          </Link>
          <a
            href="https://play.google.com/apps/testing/com.racepilot.mobile"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '16px 32px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '18px',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Download App
          </a>
        </div>
      </section>
    </div>
  );
}
