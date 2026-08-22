import { appRouter } from "../../server/routers.js";
import { createContext } from "../../server/_core/context.js";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../../server/routers.js";
import { createContext } from "../../server/_core/context.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

export default function handler(req: express.Request, res: express.Response) {
  return app(req, res);
}
