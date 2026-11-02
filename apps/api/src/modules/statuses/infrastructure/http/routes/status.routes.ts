import { Router } from "express";
import { listStatusesController } from "../controller/status.controller.js";

export const statusRoutes = Router();

statusRoutes.get("/statuses", listStatusesController);
