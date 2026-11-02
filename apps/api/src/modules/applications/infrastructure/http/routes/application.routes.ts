import { Router } from "express";
import {
  changeApplicationStatusController,
  createApplicationController,
  deleteApplicationController,
  getApplicationController,
  listApplicationsController,
  updateApplicationController,
} from "../controller/application.controller.js";

export const applicationRoutes = Router();

applicationRoutes.post("/applications", createApplicationController);
applicationRoutes.get("/applications", listApplicationsController);
applicationRoutes.get("/applications/:id", getApplicationController);
applicationRoutes.patch("/applications/:id", updateApplicationController);
applicationRoutes.patch("/applications/:id/status", changeApplicationStatusController);
applicationRoutes.delete("/applications/:id", deleteApplicationController);
