import * as Sentry from "@sentry/node";

export const logger = ({
  message,
  context,
}: {
  message: string;
  context?: unknown;
}) => {
  return {
    info: () => console.info(message, context),
    error: () => {
      let contextStringified;
      try {
        contextStringified = context ? JSON.stringify(context) : null;
      } catch (error) {
        contextStringified = "Error stringifying context";
      }
      Sentry.setContext("error context", {
        context: contextStringified,
      });
      Sentry.captureException(new Error(message));
      process.env.NODE_ENV !== "production" && console.error(message, context);
    },
    warn: () => console.warn(message, context),
  };
};
