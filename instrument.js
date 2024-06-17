// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://8c9c24e8d70ccfbeb90e69e9f8033682@o4507430325649408.ingest.de.sentry.io/4507430332006480",
    integrations: [nodeProfilingIntegration()],

    environment: process.env.NODE_ENV || "development",
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions

    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  });
}
