import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { OpenAPIRegistry, OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { errorHandler } from "./middlewares/errors.middleware.js";
import { routes } from "./route.js";

const app = express();

app.use(cors());

app.use(express.json());

const { definitions } = new OpenAPIRegistry();

const docs = new OpenApiGeneratorV31(definitions).generateDocument({
  openapi: "3.1.0",
  info: {
    title: "Controle de Candidaturas API",
    version: "1.0.0",
  },
  servers: [{ url: "/" }],
});

app.get("/openapi.json", (_req, res) => {
  res.json(docs);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(docs));

app.use(routes);
app.use(errorHandler);

export { app };
