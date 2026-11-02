import { Router } from "express";
import { getDashboardController } from "../controller/dashboard.controller.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/dashboard", getDashboardController);
