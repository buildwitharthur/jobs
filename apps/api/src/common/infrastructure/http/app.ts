import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { errorHandler } from "./middlewares/errors.middleware.js";
import { docs, registry } from "./openapi.js";
import { routes } from "./routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/openapi.json", (_req, res) => {
  res.json(docs);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(docs));

app.use(routes);
app.use(errorHandler);

export { app };
