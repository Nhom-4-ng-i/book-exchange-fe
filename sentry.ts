import * as Sentry from "@sentry/react-native";

export const navigationIntegration = Sentry.reactNavigationIntegration();

Sentry.init({
  dsn: 'https://cdf50c32e2af1aa0e5dbb90fa2525c24@o4510374047186944.ingest.de.sentry.io/4510379644354640',  // Thay bằng DSN của bạn
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
  replaysSessionSampleRate: 0.1, // 10% sessions
  replaysOnErrorSampleRate: 1.0, // 100% khi có error
  
  // Integrations
  integrations: [
    navigationIntegration,
    Sentry.mobileReplayIntegration(),
  ],
  
  // Privacy
  sendDefaultPii: false, // Không gửi thông tin cá nhân mặc định
  maxBreadcrumbs: 150,
});