import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a)',
      color: '#ffffff'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
            <img
              src="https://raw.githubusercontent.com/GP14BUILD/racepilotimages/main/ChatGPT%20Image%20Nov%208%2C%202025%2C%2002_40_39%20PM.png"
              alt="RacePilot Logo"
              style={{
                height: '64px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
            <span style={{ color: '#60a5fa', fontSize: '24px', fontWeight: '700' }}>RacePilot</span>
          </Link>

          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link to="/features" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>
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
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '56px',
          fontWeight: '800',
          marginBottom: '24px',
          background: 'linear-gradient(to right, #ffffff, #60a5fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1.2'
        }}>
          Intelligent Sailing Analytics<br />That Makes You Faster
        </h1>

        <p style={{
          fontSize: '20px',
          color: '#cbd5e1',
          maxWidth: '700px',
          margin: '0 auto 40px',
          lineHeight: '1.6'
        }}>
          Automatic maneuver detection, personalized coaching insights, and wind pattern analysis.
          Professional GPS hardware meets our proprietary analytics system.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="#packages"
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
              transition: 'transform 0.2s',
              display: 'inline-block'
            }}
          >
            View Packages
          </a>
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
              transition: 'all 0.2s',
              display: 'inline-block'
            }}
          >
            Download App
          </a>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          marginTop: '80px',
          maxWidth: '900px',
          margin: '80px auto 0'
        }}>
          <div>
            <div style={{ fontSize: '40px', fontWeight: '800', color: '#60a5fa' }}>Auto</div>
            <div style={{ fontSize: '16px', color: '#94a3b8', marginTop: '8px' }}>Maneuver Detection</div>
          </div>
          <div>
            <div style={{ fontSize: '40px', fontWeight: '800', color: '#60a5fa' }}>10Hz</div>
            <div style={{ fontSize: '16px', color: '#94a3b8', marginTop: '8px' }}>Pro GPS (Garmin GLO 2)</div>
          </div>
          <div>
            <div style={{ fontSize: '40px', fontWeight: '800', color: '#60a5fa' }}>Smart</div>
            <div style={{ fontSize: '16px', color: '#94a3b8', marginTop: '8px' }}>Coaching Insights</div>
          </div>
        </div>
      </section>

      {/* How It Works - Session Recording & Improvement Tracking */}
      <section style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '80px 24px',
        background: 'rgba(59, 130, 246, 0.05)',
        borderRadius: '24px',
        border: '1px solid rgba(59, 130, 246, 0.2)'
      }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: '800',
          marginBottom: '16px',
          textAlign: 'center',
          background: 'linear-gradient(to right, #ffffff, #60a5fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          How RacePilot Helps You Improve
        </h2>
        <p style={{
          fontSize: '18px',
          color: '#94a3b8',
          textAlign: 'center',
          marginBottom: '60px',
          maxWidth: '800px',
          margin: '0 auto 60px'
        }}>
          Every session you sail builds a complete picture of your performance. Our system learns your sailing patterns and identifies exactly where you're losing time.
        </p>

        <div style={{ display: 'grid', gap: '32px' }}>
          {/* Step 1 */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            <div style={{
              minWidth: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: '800',
              color: '#fff'
            }}>1</div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                Record Every Session
              </h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '16px' }}>
                Mount your GPS on the mast, start the app, and go sailing. RacePilot captures every second of your session at 10Hz precision - that's 10 position points per second, 600 per minute. Every tack, every gybe, every wind shift, every speed change is recorded with professional-grade accuracy.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            <div style={{
              minWidth: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: '800',
              color: '#fff'
            }}>2</div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                Automatic Analysis After Each Sail
              </h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '16px', marginBottom: '12px' }}>
                When you finish and sync your session, our intelligent analytics system goes to work. It automatically identifies every maneuver you performed - tacks, gybes, mark roundings, starts - without you tagging anything manually. For each maneuver, the system measures:
              </p>
              <ul style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '16px', paddingLeft: '20px' }}>
                <li>How much speed you lost during the tack</li>
                <li>How long it took to recover to full speed</li>
                <li>Your heading change precision</li>
                <li>Whether you tacked on a lift or header</li>
                <li>How you compare to your previous tacks</li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            <div style={{
              minWidth: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: '800',
              color: '#fff'
            }}>3</div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                Personalized Coaching Insights
              </h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '16px', marginBottom: '12px' }}>
                The system doesn't just show you data - it tells you what went wrong and how to fix it. After analyzing your session, you receive specific, actionable recommendations:
              </p>
              <ul style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '16px', paddingLeft: '20px' }}>
                <li>"Your tacks are losing 1.2 knots on average - focus on smoother helm movement"</li>
                <li>"You tacked into a header 4 times - wait for the lift before tacking"</li>
                <li>"Your mark roundings are costing you 8 seconds each - carry more speed in"</li>
                <li>"You sailed the left side of the course but the right paid - wind shifted 15° persistent"</li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            <div style={{
              minWidth: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: '800',
              color: '#fff'
            }}>4</div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                Track Improvement Over Time
              </h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '16px' }}>
                Every session adds to your performance history. The system builds up a complete picture of your sailing patterns across weeks and months. You can see your tacking efficiency improve from session to session, track your average speed trending upward, and watch as the mistakes become less frequent. Compare this week's race to last week's, this month to last month. The data shows exactly where you've improved and where you still need work.
              </p>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '48px',
          padding: '32px',
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{
            fontSize: '18px',
            color: '#60a5fa',
            fontWeight: '600',
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            The Key Difference
          </p>
          <p style={{
            fontSize: '16px',
            color: '#cbd5e1',
            lineHeight: '1.8',
            textAlign: 'center'
          }}>
            Other GPS trackers just show you a line on a map. RacePilot shows you a line on a map AND tells you exactly what you did wrong, why it was wrong, and how to fix it. Every session makes you faster because you know precisely what to work on next time.
          </p>
        </div>
      </section>

      {/* Why RacePilot Section */}
      <section id="features" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px'
      }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: '800',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          Why Choose RacePilot?
        </h2>
        <p style={{
          fontSize: '18px',
          color: '#94a3b8',
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          Advanced analytics that traditional GPS trackers can't match
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px'
        }}>
          {/* Feature 1 - Automatic Maneuver Detection */}
          <div style={{
            padding: '32px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚡</div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
              Automatic Maneuver Detection
            </h3>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
              Automatically detect and analyze tacks, gybes, mark roundings, and starts.
              No manual tagging required - our intelligent system does it all in real-time.
            </p>
          </div>

          {/* Feature 2 - Intelligent Coaching */}
          <div style={{
            padding: '32px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>💡</div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
              Personalized Coaching Insights
            </h3>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
              Get instant insights on tack efficiency, speed loss, and tactical errors.
              Like having an Olympic coach analyze every race.
            </p>
          </div>

          {/* Feature 3 - Wind Pattern Analysis */}
          <div style={{
            padding: '32px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>💨</div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
              Smart Wind Analysis
            </h3>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
              Automatically detect wind shifts, oscillations, and persistent patterns.
              Understand which side of the course paid off and why.
            </p>
          </div>

          {/* Feature 4 - Fleet Comparison & Race Replay */}
          <div style={{
            padding: '32px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>🗺️</div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
              Fleet Comparison & Race Replay
            </h3>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
              Compare multiple sailors side-by-side on the same map. Replay races to see
              exactly where you gained or lost positions. Learn from the fastest boats.
            </p>
          </div>

          {/* Feature 5 */}
          <div style={{
            padding: '32px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>🏆</div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
              Club Integration
            </h3>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
              Seamless integration with your sailing club. Share sessions,
              compare with fleet mates, and track club-wide performance.
            </p>
          </div>

          {/* Feature 6 */}
          <div style={{
            padding: '32px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>📱</div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
              Works Offline
            </h3>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
              Record full sailing sessions without cellular connection.
              Data syncs automatically when you're back on shore.
            </p>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px'
      }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: '800',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          Complete Packages
        </h2>
        <p style={{
          fontSize: '18px',
          color: '#94a3b8',
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          Everything you need to start tracking like a pro
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {/* Starter Package */}
          <div style={{
            padding: '40px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative'
          }}>
            <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
              Starter Package
            </h3>
            <div style={{ fontSize: '48px', fontWeight: '800', color: '#60a5fa', marginBottom: '24px' }}>
              $249
            </div>

            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
              <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                ✓ Garmin GLO 2 GPS Receiver
              </li>
              <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                ✓ NANUK Nano 310 Waterproof Case
              </li>
              <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                ✓ RAM Mount Mast Bracket
              </li>
              <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                ✓ RacePilot App (3 months included)
              </li>
              <li style={{ padding: '12px 0', color: '#cbd5e1' }}>
                ✓ Quick Start Guide
              </li>
            </ul>

            <button style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}>
              Coming Soon
            </button>
          </div>

          {/* Pro Package */}
          <div style={{
            padding: '40px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
            borderRadius: '20px',
            border: '2px solid rgba(59, 130, 246, 0.5)',
            position: 'relative',
            transform: 'scale(1.05)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              right: '20px',
              padding: '6px 16px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700'
            }}>
              BEST VALUE
            </div>

            <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
              Pro Package
            </h3>
            <div style={{ fontSize: '48px', fontWeight: '800', color: '#60a5fa', marginBottom: '24px' }}>
              $749
            </div>

            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
              <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: '600' }}>
                ✓ Everything in Starter, plus:
              </li>
              <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                ✓ Calypso Ultrasonic Wind Sensor
              </li>
<li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                ✓ Premium RAM Mounting System
              </li>
              <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                ✓ 12 Months Subscription
              </li>
              <li style={{ padding: '12px 0', color: '#cbd5e1' }}>
                ✓ Priority Support
              </li>
            </ul>

            <button style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)'
            }}>
              Coming Soon
            </button>
          </div>

          {/* App Only */}
          <div style={{
            padding: '40px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
              App Only
            </h3>
            <div style={{ fontSize: '48px', fontWeight: '800', color: '#60a5fa', marginBottom: '24px' }}>
              Free
            </div>

            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
              <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                ✓ RacePilot Mobile App
              </li>
              <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                ✓ Phone GPS Tracking
              </li>
              <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                ✓ Basic Analytics
              </li>
              <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                ✓ Club Integration
              </li>
              <li style={{ padding: '12px 0', color: '#94a3b8' }}>
                ⊘ Premium GPS Accuracy
              </li>
            </ul>

            <a
              href="https://play.google.com/apps/testing/com.racepilot.mobile"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                width: '100%',
                padding: '16px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                color: '#60a5fa',
                fontSize: '16px',
                fontWeight: '700',
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
            >
              Download Now
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <div style={{
          padding: '60px 40px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
          borderRadius: '24px',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>
            Ready to Elevate Your Racing?
          </h2>
          <p style={{ fontSize: '18px', color: '#cbd5e1', marginBottom: '32px' }}>
            Join the RacePilot beta and be among the first to experience
            professional-grade GPS tracking.
          </p>
          <a
            href="https://play.google.com/apps/testing/com.racepilot.mobile"
            target="_blank"
            rel="noopener noreferrer"
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
            Join Beta Testing
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '40px 24px',
        textAlign: 'center',
        color: '#94a3b8'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <img
              src="/logo.png"
              alt="RacePilot Logo"
              style={{
                height: '40px',
                width: 'auto',
                objectFit: 'contain',
                opacity: 0.7
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '16px' }}>
            <Link to="/privacy-policy" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>
              Privacy Policy
            </Link>
            <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>
              Dashboard Login
            </Link>
          </div>
          <p style={{ fontSize: '14px' }}>
            © 2025 RacePilot. Professional GPS Sailing Analytics.
          </p>
        </div>
      </footer>
    </div>
  );
}
