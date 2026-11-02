import { z } from "zod";
import type { ResumeWithUsage } from "../../../domain/models/resume.model.js";

export const resumeResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
  file_name: z.string(),
  file_url: z.string(),
  applications_count: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const toResumeResponse = (resume: ResumeWithUsage) => ({
  id: resume.id,
  name: resume.name,
  description: resume.description,
  file_name: resume.file_name,
  file_url: `/resumes/${resume.id}/file`,
  applications_count: resume.applications_count,
  created_at: resume.created_at.toISOString(),
  updated_at: resume.updated_at.toISOString(),
});
