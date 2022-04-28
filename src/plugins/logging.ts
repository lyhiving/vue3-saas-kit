import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";
import { Vue } from "@sentry/vue/dist/types";

export default function setLogger(app: Vue | Vue[] | undefined, router) {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_VUE_APP_INTEGRATIONS_LOGGING_SENTRY?.toString(),
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ["localhost", "PRODUCT_URL", /^\//],
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}
