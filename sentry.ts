import * as Sentry from "@sentry/react-native";

export const navigationIntegration = Sentry.reactNavigationIntegration();

Sentry.init({
  dsn: 'https://cdf50c32e2af1aa0e5dbb90fa2525c24@o4510374047186944.ingest.de.sentry.io/4510379644354640',  // Thay bằng DSN của bạn
  tracePropagationTargets: ["https://myproject.org", /^\/api\//],
  debug: true,// Bật để xem logs khi test

  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% transactions khi test
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 5000,

  // User Interaction Tracking
  enableUserInteractionTracing: true,

  // Profiling
  profilesSampleRate: 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 1.0, // Ghi lại 100% session khi test
  replaysOnErrorSampleRate: 1.0, // Ghi lại 100% khi có error
  
  // Integrations
  integrations: [
    // Mobile replay integration with minimal configuration
    // See: https://docs.sentry.io/platforms/react-native/session-replay/configuration/
    Sentry.mobileReplayIntegration({
      maskAllText: true,
      maskAllImages: true,
    }),
    navigationIntegration,
    Sentry.hermesProfilingIntegration({
      platformProfilers: true,
    }),
  ],
  
  // Privacy
  sendDefaultPii: false, // Không gửi thông tin cá nhân mặc định
  maxBreadcrumbs: 150,
  
  // Enable native crash handling
  enableNative: true,
  enableNativeCrashHandling: true,
  enableAutoPerformanceTracing: true,
  
  // Debug configuration
  _experiments: {
    captureFailedRequests: true,
  },
});
