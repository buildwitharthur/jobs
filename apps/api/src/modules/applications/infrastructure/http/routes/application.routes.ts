import { Router } from "express";
import { changeApplicationStatusController } from "../controller/change-application-status.controller.js";
import { createApplicationController } from "../controller/create-application.controller.js";
import { deleteApplicationController } from "../controller/delete-application.controller.js";
import { getApplicationController } from "../controller/get-application.controller.js";
import { listApplicationsController } from "../controller/list-applications.controller.js";
import { updateApplicationController } from "../controller/update-application.controller.js";

export const applicationRoutes = Router();

applicationRoutes.post("/applications", createApplicationController);
applicationRoutes.get("/applications", listApplicationsController);
applicationRoutes.get("/applications/:id", getApplicationController);
applicationRoutes.patch("/applications/:id", updateApplicationController);
applicationRoutes.patch("/applications/:id/status", changeApplicationStatusController);
applicationRoutes.delete("/applications/:id", deleteApplicationController);
