import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middlewares/errors.middleware.js";
import { generateOpenApiDocument } from "./openapi.js";
import { routes } from "./routes.js";

const app = express();

app.use(cors());

app.use(express.json());

// `routes` já foi importado (e com ele todos os controllers), então os paths estão registrados.
const docs = generateOpenApiDocument();

app.get("/openapi.json", (_req, res) => {
  res.json(docs);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(docs));

app.use(routes);
app.use(errorHandler);

export { app };
