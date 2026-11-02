import { Router } from "express";
import { getDashboardController } from "../controller/get-dashboard.controller.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/dashboard", getDashboardController);
