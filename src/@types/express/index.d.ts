import * as express from 'express';
import { Express } from "express-serve-static-core";

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
    }
  }
}
