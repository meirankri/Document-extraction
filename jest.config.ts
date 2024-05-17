import type { Config } from "@jest/types";
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  watchPathIgnorePatterns: ["/node_modules/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
export default config;
