import * as Sentry from "@sentry/node";

export const logger = ({
  message,
  context,
}: {
  message: string;
  context?: unknown;
}) => {
  return {
    info: () => console.log(message, context),
    error: () => {
      Sentry.setContext("error context", { context: JSON.stringify(context) });
      Sentry.captureException(new Error("something went wrong"));
      process.env.NODE_ENV !== "production" && console.error(message, context);
    },
    warn: () => console.warn(message, context),
  };
};
