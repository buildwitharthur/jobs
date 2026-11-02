import { Router } from "express";
import { statusRoutes } from "../../../modules/statuses/infrastructure/http/routes/status.routes.js";

const routes = Router();

routes.use(statusRoutes);

export { routes };
