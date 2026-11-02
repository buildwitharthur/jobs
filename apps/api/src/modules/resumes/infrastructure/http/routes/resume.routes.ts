import { Router } from "express";
import {
  createResumeController,
  deleteResumeController,
  getResumeController,
  getResumeFileController,
  listResumeApplicationsController,
  listResumesController,
  replaceResumeFileController,
  updateResumeController,
} from "../controller/resume.controller.js";

export const resumeRoutes = Router();

resumeRoutes.post("/resumes", createResumeController);
resumeRoutes.get("/resumes", listResumesController);
resumeRoutes.get("/resumes/:id", getResumeController);
resumeRoutes.get("/resumes/:id/file", getResumeFileController);
resumeRoutes.get("/resumes/:id/applications", listResumeApplicationsController);
resumeRoutes.patch("/resumes/:id", updateResumeController);
resumeRoutes.put("/resumes/:id/file", replaceResumeFileController);
resumeRoutes.delete("/resumes/:id", deleteResumeController);
