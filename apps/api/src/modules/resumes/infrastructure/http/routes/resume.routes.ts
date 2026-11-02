import { Router } from "express";
import { createResumeController } from "../controller/create-resume.controller.js";
import { deleteResumeController } from "../controller/delete-resume.controller.js";
import { getResumeFileController } from "../controller/get-resume-file.controller.js";
import { getResumeController } from "../controller/get-resume.controller.js";
import { listResumeApplicationsController } from "../controller/list-resume-applications.controller.js";
import { listResumesController } from "../controller/list-resumes.controller.js";
import { replaceResumeFileController } from "../controller/replace-resume-file.controller.js";
import { updateResumeController } from "../controller/update-resume.controller.js";

export const resumeRoutes = Router();

resumeRoutes.post("/resumes", createResumeController);
resumeRoutes.get("/resumes", listResumesController);
resumeRoutes.get("/resumes/:id", getResumeController);
resumeRoutes.get("/resumes/:id/file", getResumeFileController);
resumeRoutes.get("/resumes/:id/applications", listResumeApplicationsController);
resumeRoutes.patch("/resumes/:id", updateResumeController);
resumeRoutes.put("/resumes/:id/file", replaceResumeFileController);
resumeRoutes.delete("/resumes/:id", deleteResumeController);
