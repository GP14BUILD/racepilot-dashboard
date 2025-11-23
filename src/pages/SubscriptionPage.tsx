import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlans, getSubscriptionStatus, createCheckoutSession, cancelSubscription } from '../api';
import type { SubscriptionPlan, SubscriptionStatus } from '../api';

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<Record<string, SubscriptionPlan>>({});
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansData, statusData] = await Promise.all([
        getPlans(),
        getSubscriptionStatus()
      ]);
      setPlans(plansData);
      setSubscriptionStatus(statusData);
    } catch (err: any) {
      console.error('Failed to load subscription data:', err);
      setError(err.response?.data?.detail || 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setProcessing(true);
      const successUrl = `${window.location.origin}/subscription?success=true`;
      const cancelUrl = `${window.location.origin}/subscription?canceled=true`;

      const { checkout_url } = await createCheckoutSession(planId, successUrl, cancelUrl);

      // Redirect to Stripe Checkout
      window.location.href = checkout_url;
    } catch (err: any) {
      console.error('Failed to create checkout session:', err);
      alert(err.response?.data?.detail || 'Failed to start subscription process');
      setProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your billing period.')) {
      return;
    }

    try {
      setProcessing(true);
      await cancelSubscription();
      alert('Subscription will be cancelled at the end of your billing period');
      await loadData();
    } catch (err: any) {
      console.error('Failed to cancel subscription:', err);
      alert(err.response?.data?.detail || 'Failed to cancel subscription');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ocean-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading subscription info...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-dark p-6 rounded-xl">
        <div className="text-center">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Error Loading Subscription</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-ocean-600 hover:bg-ocean-700 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-dark p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Subscription & Billing</h1>
            <p className="text-slate-400">Manage your RacePilot subscription</p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 bg-ocean-600 hover:bg-ocean-700 rounded-lg transition"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Current Subscription Status */}
        {subscriptionStatus && (
          <div className={`p-4 rounded-lg ${subscriptionStatus.subscribed ? 'bg-green-900/30 border border-green-500/30' : 'bg-slate-800/50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold mb-1">
                  {subscriptionStatus.subscribed ? '✅ Active Subscription' : '📦 Free Plan'}
                </div>
                <div className="text-sm text-slate-400">
                  {subscriptionStatus.subscribed ? (
                    <>
                      Plan: {subscriptionStatus.plan} •
                      Status: {subscriptionStatus.status} •
                      {subscriptionStatus.current_period_end && (
                        <> Renews: {new Date(subscriptionStatus.current_period_end).toLocaleDateString()}</>
                      )}
                    </>
                  ) : (
                    <>Limited to {subscriptionStatus.features.max_sessions} sessions per month</>
                  )}
                </div>
              </div>
              {subscriptionStatus.subscribed && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={processing}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Cancel Subscription'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Features Included */}
      {subscriptionStatus && (
        <div className="glass-dark p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Your Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-3xl mb-2 ${subscriptionStatus.features.max_sessions === -1 ? 'text-green-400' : 'text-slate-400'}`}>
                {subscriptionStatus.features.max_sessions === -1 ? '∞' : subscriptionStatus.features.max_sessions}
              </div>
              <div className="text-sm text-slate-400">Sessions/Month</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl mb-2 ${subscriptionStatus.features.ai_coaching ? 'text-green-400' : 'text-slate-600'}`}>
                {subscriptionStatus.features.ai_coaching ? '✅' : '🔒'}
              </div>
              <div className="text-sm text-slate-400">AI Coaching</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl mb-2 ${subscriptionStatus.features.fleet_replay ? 'text-green-400' : 'text-slate-600'}`}>
                {subscriptionStatus.features.fleet_replay ? '✅' : '🔒'}
              </div>
              <div className="text-sm text-slate-400">Fleet Replay</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl mb-2 ${subscriptionStatus.features.wind_analysis ? 'text-green-400' : 'text-slate-600'}`}>
                {subscriptionStatus.features.wind_analysis ? '✅' : '🔒'}
              </div>
              <div className="text-sm text-slate-400">Wind Analysis</div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Plans */}
      {!subscriptionStatus?.subscribed && Object.keys(plans).length > 0 && (
        <div className="glass-dark p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Upgrade to Pro</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {Object.entries(plans).map(([planId, plan]) => (
              <div
                key={planId}
                className="glass-dark p-6 rounded-xl border-2 border-ocean-500/30 hover:border-ocean-500 transition"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-ocean-400 mb-1">
                    ${plan.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-400">per {plan.interval}</div>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-sm">
                    <span className="text-green-400 mr-2">✓</span>
                    Unlimited sessions
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-400 mr-2">✓</span>
                    AI coaching insights
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-400 mr-2">✓</span>
                    Wind pattern analysis
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-400 mr-2">✓</span>
                    Fleet replay mode
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-400 mr-2">✓</span>
                    Advanced analytics
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-400 mr-2">✓</span>
                    Export data
                  </li>
                </ul>

                <button
                  onClick={() => handleSubscribe(planId)}
                  disabled={processing}
                  className="w-full px-6 py-3 bg-ocean-600 hover:bg-ocean-700 rounded-lg font-bold transition disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Subscribe Now'}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-slate-400">
            <p>Cancel anytime. Secure payment powered by Stripe.</p>
          </div>
        </div>
      )}

      {/* Success/Cancel Messages */}
      {new URLSearchParams(window.location.search).get('success') === 'true' && (
        <div className="glass-dark p-6 rounded-xl border-2 border-green-500/50 bg-green-900/20">
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Subscription Activated!</h2>
            <p className="text-slate-400 mb-4">
              Welcome to RacePilot Pro! You now have access to all premium features.
            </p>
            <button
              onClick={() => window.location.href = '/subscription'}
              className="px-6 py-2 bg-ocean-600 hover:bg-ocean-700 rounded-lg transition"
            >
              Refresh Status
            </button>
          </div>
        </div>
      )}

      {new URLSearchParams(window.location.search).get('canceled') === 'true' && (
        <div className="glass-dark p-6 rounded-xl border-2 border-yellow-500/50 bg-yellow-900/20">
          <div className="text-center">
            <div className="text-5xl mb-4">💭</div>
            <h2 className="text-2xl font-bold mb-2">Subscription Cancelled</h2>
            <p className="text-slate-400">
              You can try again anytime you're ready to upgrade.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
