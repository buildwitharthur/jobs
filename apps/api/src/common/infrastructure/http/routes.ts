import { Router } from "express";
import { applicationRoutes } from "../../../modules/applications/infrastructure/http/routes/application.routes.js";
import { boardRoutes } from "../../../modules/board/infrastructure/http/routes/board.routes.js";
import { dashboardRoutes } from "../../../modules/dashboard/infrastructure/http/routes/dashboard.routes.js";
import { eventRoutes } from "../../../modules/events/infrastructure/http/routes/event.routes.js";
import { resumeRoutes } from "../../../modules/resumes/infrastructure/http/routes/resume.routes.js";
import { statusRoutes } from "../../../modules/statuses/infrastructure/http/routes/status.routes.js";

const routes = Router();

routes.use(statusRoutes);
routes.use(applicationRoutes);
routes.use(eventRoutes);
routes.use(boardRoutes);
routes.use(resumeRoutes);
routes.use(dashboardRoutes);

export { routes };
