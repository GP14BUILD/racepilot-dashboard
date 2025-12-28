import { useState, useEffect } from 'react';

interface OnboardingGuideProps {
  onComplete: () => void;
}

export default function OnboardingGuide({ onComplete }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to RacePilot! ⛵",
      content: (
        <div>
          <p className="mb-4">We're excited to have you on board! Let's take a quick tour of the platform.</p>
          <div className="bg-ocean-500/10 border border-ocean-500/30 rounded-lg p-4 mb-4">
            <h4 className="font-semibold mb-2">What is RacePilot?</h4>
            <p className="text-sm text-slate-300">
              RacePilot is a professional GPS sailing analytics platform that helps you track, analyze, and improve your racing performance with 10Hz precision data.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Dashboard Overview 📊",
      content: (
        <div>
          <p className="mb-4">Your dashboard is your command center for all racing data.</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-ocean-400 font-bold">•</span>
              <span><strong>Recent Sessions:</strong> View your latest sailing sessions and race replays</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-ocean-400 font-bold">•</span>
              <span><strong>Performance Metrics:</strong> Track your speed, VMG, and maneuver efficiency</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-ocean-400 font-bold">•</span>
              <span><strong>Fleet Comparison:</strong> See how you stack up against club mates</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "Getting Started 🚀",
      content: (
        <div>
          <p className="mb-4">Here's how to start tracking your sessions:</p>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-ocean-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <strong>Download the Mobile App</strong>
                <p className="text-sm text-slate-400 mt-1">Get RacePilot from Google Play Store</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-ocean-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <strong>Mount Your GPS</strong>
                <p className="text-sm text-slate-400 mt-1">Attach your device to the mast for best reception</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-ocean-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <div>
                <strong>Start Recording</strong>
                <p className="text-sm text-slate-400 mt-1">Hit record before you head out and stop when you're done</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-ocean-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <div>
                <strong>Analyze on Web</strong>
                <p className="text-sm text-slate-400 mt-1">Your sessions automatically sync to this dashboard</p>
              </div>
            </li>
          </ol>
        </div>
      )
    },
    {
      title: "Need Help? 💬",
      content: (
        <div>
          <p className="mb-4">We're here to help you get the most out of RacePilot!</p>
          <div className="space-y-3">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold mb-2">📧 Send Feedback</h4>
              <p className="text-sm text-slate-300 mb-2">
                Click the "Feedback" button in the navigation to report issues or suggest features.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold mb-2">📚 Documentation</h4>
              <p className="text-sm text-slate-300">
                Visit our help center for detailed guides and tutorials.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold mb-2">✉️ Email Support</h4>
              <p className="text-sm text-slate-300">
                Reach us at <a href="mailto:info@race-pilot.app" className="text-ocean-400 hover:underline">info@race-pilot.app</a>
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as complete
      localStorage.setItem('onboarding_complete', 'true');
      onComplete();
    }
  };

  const skipOnboarding = () => {
    localStorage.setItem('onboarding_complete', 'true');
    onComplete();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 9999
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) skipOnboarding();
      }}
    >
      <div
        className="glass-dark p-8 rounded-xl max-w-2xl w-full"
        style={{
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex gap-2 mb-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-ocean-500'
                    : index < currentStep
                    ? 'bg-ocean-700'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-slate-400">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Content */}
        <h2 className="text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-ocean-400 to-blue-500 bg-clip-text text-transparent">
            {steps[currentStep].title}
          </span>
        </h2>

        <div className="text-slate-200 mb-8">
          {steps[currentStep].content}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          <button
            onClick={skipOnboarding}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition"
          >
            Skip Tour
          </button>
          <button
            onClick={nextStep}
            className="flex-1 px-6 py-3 bg-ocean-600 hover:bg-ocean-700 rounded-lg font-semibold transition"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
