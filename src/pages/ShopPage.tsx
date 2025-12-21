import { Link } from 'react-router-dom';

export default function ShopPage() {
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
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img
              src="https://raw.githubusercontent.com/GP14BUILD/racepilotimages/main/ChatGPT%20Image%20Nov%208%2C%202025%2C%2002_34_49%20PM.png"
              alt="RacePilot Logo"
              style={{
                height: '48px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
            <span style={{ color: '#60a5fa', fontSize: '20px', fontWeight: '700' }}>RacePilot</span>
          </Link>

          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link to="/features" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>
              Features
            </Link>
            <Link to="/shop" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>
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
                textDecoration: 'none'
              }}
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 24px 40px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '800',
          marginBottom: '16px',
          background: 'linear-gradient(to right, #ffffff, #60a5fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Complete RacePilot Packages
        </h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '700px', margin: '0 auto' }}>
          Everything you need for professional GPS sailing tracking. Hardware, software, and support in one package.
        </p>
      </section>

      {/* Packages Grid */}
      <section style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '40px'
        }}>
          {/* Starter Package */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '40px 40px 32px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
                Starter Package
              </h2>
              <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
                Professional GPS tracking for serious sailors
              </p>
              <div style={{ fontSize: '56px', fontWeight: '800', color: '#60a5fa', marginBottom: '8px' }}>
                $249
              </div>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '32px' }}>
                One-time purchase + subscription
              </p>

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
                marginBottom: '32px'
              }}>
                Coming Soon
              </button>

              <div style={{
                padding: '24px',
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: '16px',
                marginBottom: '32px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
                  What's Included:
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
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
                    ✓ RacePilot Mobile App
                  </li>
                  <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                    ✓ 3 Months Subscription
                  </li>
                  <li style={{ padding: '12px 0', color: '#cbd5e1' }}>
                    ✓ Quick Start Guide
                  </li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
                  Technical Specifications:
                </h3>
                <div style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.8' }}>
                  <p><strong style={{ color: '#fff' }}>GPS Accuracy:</strong> ±3 meters (WAAS/EGNOS enabled)</p>
                  <p><strong style={{ color: '#fff' }}>Update Rate:</strong> 10 Hz (10 times per second)</p>
                  <p><strong style={{ color: '#fff' }}>Case Rating:</strong> IP67 waterproof, crushproof</p>
                  <p><strong style={{ color: '#fff' }}>Mounting:</strong> Universal mast clamp (fits 25-40mm)</p>
                  <p><strong style={{ color: '#fff' }}>Battery Life:</strong> 13+ hours continuous use</p>
                  <p><strong style={{ color: '#fff' }}>Connectivity:</strong> Bluetooth wireless</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Package */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15))',
            borderRadius: '24px',
            border: '2px solid rgba(59, 130, 246, 0.5)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderBottomLeftRadius: '12px',
              fontSize: '14px',
              fontWeight: '700'
            }}>
              BEST VALUE
            </div>

            <div style={{ padding: '40px 40px 32px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
                Pro Package
              </h2>
              <p style={{ color: '#cbd5e1', marginBottom: '24px' }}>
                Complete professional system with wind data
              </p>
              <div style={{ fontSize: '56px', fontWeight: '800', color: '#60a5fa', marginBottom: '8px' }}>
                $749
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '32px' }}>
                One-time purchase + 12-month subscription
              </p>

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
                boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)',
                marginBottom: '32px'
              }}>
                Coming Soon
              </button>

              <div style={{
                padding: '24px',
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: '16px',
                marginBottom: '32px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
                  What's Included:
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: '600' }}>
                    ✓ Everything in Starter Package, plus:
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
                  <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                    ✓ Priority Support
                  </li>
                  <li style={{ padding: '12px 0', color: '#cbd5e1' }}>
                    ✓ Professional Installation Guide
                  </li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
                  Additional Specifications:
                </h3>
                <div style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.8' }}>
                  <p><strong style={{ color: '#fff' }}>Wind Accuracy:</strong> ±2° direction, ±0.3 m/s speed</p>
                  <p><strong style={{ color: '#fff' }}>Wind Range:</strong> 0-50 m/s (0-100 knots)</p>
                  <p><strong style={{ color: '#fff' }}>Wind Sensor Type:</strong> Ultrasonic (no moving parts)</p>
                  <p><strong style={{ color: '#fff' }}>Data Output:</strong> TWA, TWS, AWS, AWA in real-time</p>
                  <p><strong style={{ color: '#fff' }}>Mounting:</strong> Heavy-duty RAM ball system with multiple joints</p>
                  <p><strong style={{ color: '#fff' }}>Sensor Battery:</strong> Rechargeable, 20+ hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Component Details */}
      <section style={{
        maxWidth: '1200px',
        margin: '80px auto',
        padding: '0 24px'
      }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '48px', textAlign: 'center' }}>
          Component Details
        </h2>

        <div style={{ display: 'grid', gap: '40px' }}>
          {/* Garmin GLO 2 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '40px',
            padding: '40px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div>
              <div style={{
                width: '100%',
                aspectRatio: '1',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px'
              }}>
                📡
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
                Garmin GLO 2 GPS Receiver
              </h3>
              <p style={{ color: '#cbd5e1', marginBottom: '24px', lineHeight: '1.6' }}>
                Professional-grade GPS/GLONASS receiver with 10 Hz update rate. Far superior to any smartphone GPS,
                the GLO 2 provides ±3 meter accuracy with WAAS/EGNOS correction. Battery lasts 13+ hours and connects
                wirelessly to your phone via Bluetooth.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#60a5fa' }}>10 Hz</div>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>Update Rate</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#60a5fa' }}>±3m</div>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>Accuracy</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#60a5fa' }}>13+ hrs</div>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>Battery Life</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#60a5fa' }}>Bluetooth</div>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>Wireless</div>
                </div>
              </div>
            </div>
          </div>

          {/* NANUK Case */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '40px',
            padding: '40px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div>
              <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
                NANUK Nano 310 Case
              </h3>
              <p style={{ color: '#cbd5e1', marginBottom: '24px', lineHeight: '1.6' }}>
                Military-grade waterproof case made from NK-7 resin. IP67 rated for complete protection against
                water, dust, and impacts. Custom foam insert keeps your Garmin GLO 2 secure during transport and use.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e1', fontSize: '15px' }}>
                <li style={{ padding: '8px 0' }}>✓ Waterproof, dustproof, crushproof</li>
                <li style={{ padding: '8px 0' }}>✓ PowerClaw latching system</li>
                <li style={{ padding: '8px 0' }}>✓ Custom foam insert included</li>
                <li style={{ padding: '8px 0' }}>✓ Dimensions: 6.4" x 3.7" x 2.1"</li>
              </ul>
            </div>
            <div>
              <div style={{
                width: '100%',
                aspectRatio: '1',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px'
              }}>
                🔒
              </div>
            </div>
          </div>

          {/* Calypso Wind Sensor (Pro only) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '40px',
            padding: '40px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
            borderRadius: '20px',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            <div>
              <div style={{
                width: '100%',
                aspectRatio: '1',
                background: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px'
              }}>
                💨
              </div>
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                PRO PACKAGE ONLY
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
                Calypso Ultrasonic Wind Sensor
              </h3>
              <p style={{ color: '#cbd5e1', marginBottom: '24px', lineHeight: '1.6' }}>
                Professional ultrasonic wind meter with no moving parts. Connects wirelessly via Bluetooth to provide
                real-time True Wind Angle, True Wind Speed, Apparent Wind Angle, and Apparent Wind Speed data.
                Pocket-sized, battery-powered, and marine-rated.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#60a5fa' }}>±2°</div>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>Direction Accuracy</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#60a5fa' }}>±0.3 m/s</div>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>Speed Accuracy</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#60a5fa' }}>0-100 kts</div>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>Wind Range</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#60a5fa' }}>20+ hrs</div>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>Battery Life</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{
        maxWidth: '900px',
        margin: '80px auto',
        padding: '0 24px'
      }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '48px', textAlign: 'center' }}>
          Frequently Asked Questions
        </h2>

        <div style={{ display: 'grid', gap: '24px' }}>
          {[
            {
              q: "What's included in the subscription?",
              a: "Cloud storage for unlimited sailing sessions, advanced analytics, fleet comparison tools, and access to the web dashboard. The Starter package includes 3 months, Pro includes 12 months."
            },
            {
              q: "Can I use my own Garmin GLO 2 if I already have one?",
              a: "Yes! You can purchase just the RacePilot app subscription and use your existing Garmin GLO 2. Download the app from Google Play and sign up for a monthly subscription."
            },
            {
              q: "Is the hardware waterproof?",
              a: "The Garmin GLO 2 is water-resistant (IPX7), and it's housed in the NANUK Nano 310 case which is fully waterproof (IP67). The Calypso wind sensor is marine-rated and weatherproof."
            },
            {
              q: "How do I mount the GPS on my mast?",
              a: "The RAM mount system includes a universal clamp that fits masts from 25-40mm diameter. Installation takes about 5 minutes with no tools required."
            },
            {
              q: "Does this work offline on the water?",
              a: "Yes! The app records all GPS and wind data locally on your phone. It automatically syncs to the cloud when you're back in range of WiFi or cellular."
            },
            {
              q: "When will packages be available?",
              a: "We're currently in beta testing. Join our testing program to get early access and help shape the product. Full retail availability is planned for Q2 2025."
            }
          ].map((faq, i) => (
            <div key={i} style={{
              padding: '24px',
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>
                {faq.q}
              </h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        maxWidth: '900px',
        margin: '80px auto',
        padding: '0 24px 80px'
      }}>
        <div style={{
          padding: '60px 40px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
          borderRadius: '24px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>
            Ready to Get Started?
          </h2>
          <p style={{ fontSize: '18px', color: '#cbd5e1', marginBottom: '32px' }}>
            Join the beta program and be among the first to receive RacePilot packages when they launch.
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
