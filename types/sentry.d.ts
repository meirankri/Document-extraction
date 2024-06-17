import { Response } from "express";

declare module "express-serve-static-core" {
  export interface Response {
    sentry?: string;
  }
}
