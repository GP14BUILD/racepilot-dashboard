// Google Analytics 4 Integration
const GA_MEASUREMENT_ID = 'G-HTHKXET42J';

// Load Google Analytics script
export const loadGoogleAnalytics = () => {
  // Check if already loaded
  if (window.gtag) {
    return;
  }

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
};

// Track custom events
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Track email clicks
export const trackEmailClick = () => {
  trackEvent('contact_email_click', {
    contact_method: 'email',
    email: 'info@race-pilot.app'
  });
};

// Track phone clicks
export const trackPhoneClick = () => {
  trackEvent('contact_phone_click', {
    contact_method: 'phone',
    phone: '+44 28 9447 9569'
  });
};

// Track package views
export const trackPackageView = (packageName: string, price: number) => {
  trackEvent('view_item', {
    item_name: packageName,
    price: price,
    currency: 'GBP'
  });
};

// Track CTA clicks
export const trackCTAClick = (ctaName: string) => {
  trackEvent('cta_click', {
    cta_name: ctaName
  });
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
