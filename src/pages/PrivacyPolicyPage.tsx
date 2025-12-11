import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a)',
      color: '#ffffff',
      padding: '32px 16px'
    }}>
      {/* Header */}
      <header style={{
        maxWidth: '900px',
        margin: '0 auto 48px',
        paddingBottom: '32px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#fff', marginBottom: '24px' }}>
          <img
            src="/logo.png"
            alt="RacePilot Logo"
            style={{
              height: '48px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </Link>
        <h2 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0' }}>Privacy Policy</h2>
        <p style={{ color: '#94a3b8', margin: '8px 0 0', fontSize: '14px' }}>Last Updated: December 10, 2024</p>
      </header>

      {/* Content */}
      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'rgba(30, 41, 59, 0.5)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '48px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#38bdf8' }}>1. Introduction</h3>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7', marginBottom: '12px' }}>
            Welcome to RacePilot. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and web dashboard for sailing race analysis and performance tracking.
          </p>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7' }}>
            By using RacePilot, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#38bdf8' }}>2. Information We Collect</h3>

          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', marginTop: '20px', color: '#94a3b8' }}>2.1 Location Data</h4>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7', marginBottom: '12px' }}>
            RacePilot collects precise GPS location data to track your sailing sessions, including:
          </p>
          <ul style={{ color: '#e2e8f0', lineHeight: '1.7', marginLeft: '24px', marginBottom: '12px' }}>
            <li>Latitude and longitude coordinates</li>
            <li>Speed over ground (SOG)</li>
            <li>Course over ground (COG)</li>
            <li>Altitude and heading information</li>
            <li>Timestamp of each location point</li>
          </ul>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7' }}>
            Location data is collected when you start a tracking session and continues while the app is in use or running in the background during active sessions. You can stop location tracking at any time by ending your session.
          </p>

          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', marginTop: '20px', color: '#94a3b8' }}>2.2 Bluetooth Sensor Data</h4>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7' }}>
            When you connect Bluetooth devices (such as wind sensors or marine instruments), we collect:
          </p>
          <ul style={{ color: '#e2e8f0', lineHeight: '1.7', marginLeft: '24px' }}>
            <li>Wind speed and direction data</li>
            <li>Device identifiers for reconnection</li>
            <li>Sensor telemetry and measurement data</li>
          </ul>

          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', marginTop: '20px', color: '#94a3b8' }}>2.3 Account Information</h4>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7' }}>
            When you create an account, we collect:
          </p>
          <ul style={{ color: '#e2e8f0', lineHeight: '1.7', marginLeft: '24px' }}>
            <li>Name</li>
            <li>Email address</li>
            <li>Password (encrypted)</li>
            <li>Club affiliation (if applicable)</li>
          </ul>

          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', marginTop: '20px', color: '#94a3b8' }}>2.4 Session and Performance Data</h4>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7' }}>
            We store data about your sailing sessions, including:
          </p>
          <ul style={{ color: '#e2e8f0', lineHeight: '1.7', marginLeft: '24px' }}>
            <li>Session duration and distance</li>
            <li>Boat speed and performance metrics</li>
            <li>Maneuver detection and analysis</li>
            <li>AI-generated coaching recommendations</li>
            <li>Wind pattern analysis</li>
            <li>Video recordings (if uploaded)</li>
          </ul>

          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', marginTop: '20px', color: '#94a3b8' }}>2.5 Payment Information</h4>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7' }}>
            Payment processing is handled by Stripe. We do not store your credit card information. Stripe collects:
          </p>
          <ul style={{ color: '#e2e8f0', lineHeight: '1.7', marginLeft: '24px' }}>
            <li>Payment card details</li>
            <li>Billing address</li>
            <li>Subscription status</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#38bdf8' }}>3. How We Use Your Information</h3>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7', marginBottom: '12px' }}>
            We use the collected information for the following purposes:
          </p>
          <ul style={{ color: '#e2e8f0', lineHeight: '1.7', marginLeft: '24px' }}>
            <li>To provide race analysis and performance tracking services</li>
            <li>To generate AI-powered coaching recommendations</li>
            <li>To visualize your sailing tracks and race replays</li>
            <li>To detect and analyze sailing maneuvers</li>
            <li>To analyze wind patterns and shifts</li>
            <li>To enable fleet comparison features</li>
            <li>To process subscription payments</li>
            <li>To send service-related notifications (password resets, subscription updates)</li>
            <li>To improve our services and develop new features</li>
            <li>To provide customer support</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#38bdf8' }}>4. Data Sharing and Disclosure</h3>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7', marginBottom: '12px' }}>
            We do not sell your personal information. We may share your data in the following circumstances:
          </p>

          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', marginTop: '20px', color: '#94a3b8' }}>4.1 With Your Club</h4>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7' }}>
            If you are affiliated with a sailing club, your club administrators may have access to your session data and performance metrics for coaching and team management purposes.
          </p>

          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', marginTop: '20px', color: '#94a3b8' }}>4.2 Service Providers</h4>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7' }}>
            We use third-party services to operate our platform:
          </p>
          <ul style={{ color: '#e2e8f0', lineHeight: '1.7', marginLeft: '24px' }}>
            <li><strong>Railway:</strong> Cloud hosting and infrastructure</li>
            <li><strong>Stripe:</strong> Payment processing</li>
            <li><strong>Expo/EAS:</strong> Mobile app distribution and updates</li>
          </ul>

          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', marginTop: '20px', color: '#94a3b8' }}>4.3 Legal Requirements</h4>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7' }}>
            We may disclose your information if required by law or in response to valid legal requests.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#38bdf8' }}>5. Data Retention</h3>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7' }}>
            We retain your data as long as your account is active or as needed to provide services. You can request deletion of your account and associated data at any time by contacting us.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#38bdf8' }}>6. Data Security</h3>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7' }}>
            We implement industry-standard security measures to protect your data:
          </p>
          <ul style={{ color: '#e2e8f0', lineHeight: '1.7', marginLeft: '24px' }}>
            <li>Encrypted data transmission (HTTPS/TLS)</li>
            <li>Secure password hashing</li>
            <li>Regular security updates and monitoring</li>
            <li>Access controls and authentication</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#38bdf8' }}>7. Your Rights</h3>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7', marginBottom: '12px' }}>
            You have the right to:
          </p>
          <ul style={{ color: '#e2e8f0', lineHeight: '1.7', marginLeft: '24px' }}>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
            <li>Opt-out of location tracking by not starting sessions</li>
            <li>Cancel your subscription at any time</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#38bdf8' }}>8. Children's Privacy</h3>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7' }}>
            RacePilot is not intended for users under the age of 13. We do not knowingly collect data from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#38bdf8' }}>9. International Users</h3>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7' }}>
            Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#38bdf8' }}>10. Changes to This Policy</h3>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7' }}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#38bdf8' }}>11. Contact Us</h3>
          <p style={{ color: '#e2e8f0', lineHeight: '1.7', marginBottom: '12px' }}>
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '16px'
          }}>
            <p style={{ color: '#38bdf8', margin: '0' }}>
              <strong>Email:</strong> privacy@racepilot.app
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        maxWidth: '900px',
        margin: '48px auto 0',
        padding: '32px 0',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '14px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <p style={{ margin: '0 0 8px' }}>RacePilot • Professional Race Analysis</p>
        <p style={{ margin: '0' }}>
          <Link to="/privacy-policy" style={{ color: '#38bdf8', textDecoration: 'none' }}>Privacy Policy</Link>
        </p>
      </footer>
    </div>
  );
}
