import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App.tsx";
import "./index.css";

// Add global error handler for debugging
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Initialize Sentry for error tracking
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || "",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // Sample 10% of sessions
  replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD, // Only enable in production
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  document.body.innerHTML = '<div style="padding: 20px; font-family: sans-serif;"><h1>Error: Root element not found</h1><p>Please check your HTML file.</p></div>';
} else {
  try {
    createRoot(rootElement).render(<App />);
  } catch (error) {
    console.error('Failed to render app:', error);
    document.body.innerHTML = '<div style="padding: 20px; font-family: sans-serif;"><h1>Failed to load app</h1><p>' + (error as Error).message + '</p></div>';
  }
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/ReHome/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}
