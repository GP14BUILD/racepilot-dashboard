import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What makes RacePilot different from other GPS trackers?",
      answer: "RacePilot uses our proprietary intelligent analytics system to automatically detect maneuvers, provide coaching insights, and analyze wind patterns. Traditional GPS trackers just record your track - RacePilot tells you how to get faster. Our system automatically detects tacks, gybes, mark roundings and gives you personalized recommendations."
    },
    {
      question: "Do I need to buy the hardware package?",
      answer: "You can use RacePilot with any GPS device, but we strongly recommend the Garmin GLO 2 for the best experience. Phone GPS isn't accurate enough for serious race analysis - the GLO 2 provides 10Hz updates and ±3m accuracy with WAAS/EGNOS correction. Our hardware packages include everything you need: GPS, waterproof case, and mast mount."
    },
    {
      question: "How does the automatic maneuver detection work?",
      answer: "Our intelligent analytics system analyzes your GPS track in real-time, looking for characteristic patterns in heading changes, speed variations, and boat behavior. It can detect tacks, gybes, mark roundings, and starts automatically - no manual tagging required. After each maneuver, it calculates efficiency metrics like speed loss, time to recover, and angle precision."
    },
    {
      question: "Can I compare my performance with other sailors?",
      answer: "Yes! RacePilot's Fleet Comparison feature lets you overlay multiple sailors on the same map. You can replay races side-by-side, compare speeds and VMG, and see exactly where you gained or lost positions. This is perfect for learning from faster sailors in your fleet or analyzing team racing tactics."
    },
    {
      question: "What wind sensors are compatible?",
      answer: "RacePilot works with Bluetooth wind sensors like the Calypso Ultrasonic Portable (CMI1006). These connect directly to your phone and record True Wind Angle, True Wind Speed, and Apparent Wind data during your session. The wind data integrates seamlessly with your GPS track for post-race analysis. Our Pro Package includes the Calypso sensor with the lightweight CMI1028 mast mount bracket."
    },
    {
      question: "How do I mount the wind sensor on my mast?",
      answer: "The Pro Package includes the Calypso CMI1028 Mast Mount - a lightweight stainless steel bracket specifically designed for dinghy masts. The bracket can be riveted directly to your mast for a permanent, low-profile installation that adds minimal weight. This mounting solution is ideal for dinghies and small boats where weight aloft matters. For larger boats, alternative mounting options are available."
    },
    {
      question: "Does RacePilot work offline?",
      answer: "Yes! The mobile app works completely offline - you don't need cellular connection while sailing. Your GPS data and wind sensor data are recorded locally on your phone. When you return to shore and connect to WiFi, your session automatically syncs to the cloud for analysis on the web dashboard."
    },
    {
      question: "What's included in the subscription?",
      answer: "The subscription includes unlimited session recording, automatic maneuver detection, personalized coaching insights, wind pattern analysis, fleet comparison, race replay, and cloud storage for all your sessions. Hardware packages include 3 months (Starter) or 12 months (Pro) subscription included."
    },
    {
      question: "Can I use this for club racing?",
      answer: "Absolutely! RacePilot has club integration features. You can join your sailing club, share sessions with club mates, and compare performance across the fleet. Club admins can see aggregated performance data and identify top performers. It's perfect for one-design fleets and team training."
    },
    {
      question: "How accurate is the Garmin GLO 2?",
      answer: "The Garmin GLO 2 is professional-grade GPS with 10Hz update rate (10 position fixes per second) and ±3 meter accuracy with WAAS/EGNOS correction. This is far superior to phone GPS which typically updates at 1Hz and has ±10-15m accuracy. For race analysis, this precision matters - you can see exactly where you gained or lost centimeters on the competition."
    },
    {
      question: "What's the battery life?",
      answer: "The Garmin GLO 2 battery lasts 13+ hours on a single charge - more than enough for a full day of racing. It charges via USB and comes with a charging cable. The NANUK waterproof case protects it from the elements, and the RAM Mount system makes it easy to mount on your mast."
    },
    {
      question: "How does the waterproof case protect my equipment?",
      answer: "The NANUK Nano 310 case is IP67 rated - fully waterproof and crushproof. The case also floats, providing an extra layer of protection if it ever comes free during a capsize. Each package includes custom-cut foam inserts designed to fit your specific phone model and the Garmin GLO 2 securely. The case features an extremely strong attachment strap that will keep it securely mounted to your mast even during harsh capsizes. No need to worry about losing your equipment in rough conditions."
    },
    {
      question: "Can I export my data?",
      answer: "Yes! You can export your GPS tracks as GPX files, and download session data as CSV for analysis in external tools. Your data is yours - we believe in data portability and interoperability with other sailing analytics tools."
    },
    {
      question: "Do you ship internationally?",
      answer: "We're based in the UK and currently ship within the UK and EU. International shipping to other regions is available on request. Contact us at info@race-pilot.app for international orders."
    },
    {
      question: "What's your return policy?",
      answer: "We offer a 30-day money-back guarantee on all hardware packages. If you're not satisfied with the Garmin GLO 2 or any component, return it within 30 days for a full refund. Software subscriptions are non-refundable but you can cancel anytime."
    },
    {
      question: "How do I get started?",
      answer: "1. Order a hardware package (or use your existing GPS device). 2. Download the RacePilot mobile app from Google Play or App Store. 3. Create an account and pair your GPS device. 4. Start recording sessions! Our intelligent analytics system will automatically analyze your maneuvers and provide coaching insights. View detailed analytics on the web dashboard at race-pilot.app."
    }
  ];

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
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src="https://raw.githubusercontent.com/GP14BUILD/racepilotimages/main/ChatGPT%20Image%20Nov%208%2C%202025%2C%2002_34_49%20PM.png"
            alt="RacePilot"
            style={{
              height: '48px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </Link>

        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/features" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>
            Features
          </Link>
          <Link to="/shop" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>
            Shop
          </Link>
          <Link to="/faq" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>
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
        maxWidth: '900px',
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
          Frequently Asked Questions
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#94a3b8'
        }}>
          Everything you need to know about RacePilot
        </p>
      </section>

      {/* FAQ List */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 24px 80px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                style={{
                  width: '100%',
                  padding: '24px 32px',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '18px',
                  fontWeight: '600',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {faq.question}
                <span style={{
                  fontSize: '24px',
                  color: '#60a5fa',
                  transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s'
                }}>
                  ▼
                </span>
              </button>
              {openIndex === index && (
                <div style={{
                  padding: '0 32px 24px',
                  color: '#cbd5e1',
                  lineHeight: '1.8',
                  fontSize: '16px'
                }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section style={{
        maxWidth: '800px',
        margin: '0 auto 80px',
        padding: '60px 24px',
        textAlign: 'center',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '24px',
        border: '1px solid rgba(59, 130, 246, 0.3)'
      }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>
          Still have questions?
        </h2>
        <p style={{ fontSize: '18px', color: '#cbd5e1', marginBottom: '24px' }}>
          Get in touch and we'll get back to you as soon as possible
        </p>
        <a
          href="mailto:info@race-pilot.app"
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
          Contact Us
        </a>
      </section>
    </div>
  );
}
