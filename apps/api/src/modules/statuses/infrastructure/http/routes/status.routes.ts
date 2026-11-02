import { Router } from "express";
import { listStatusesController } from "../controller/list-statuses.controller.js";

export const statusRoutes = Router();

statusRoutes.get("/statuses", listStatusesController);
