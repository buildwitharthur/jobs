import { z } from "zod";
import {
  Status,
  WorkModel,
} from "../../../../../common/infrastructure/database/prisma/generated/enums.js";
import { toIsoDate } from "../../../../../common/infrastructure/http/date.js";
import type { Application } from "../../../domain/models/application.model.js";

export const applicationResponseSchema = z.object({
  id: z.number().int(),
  company: z.string(),
  role: z.string(),
  job_url: z.string().nullable(),
  source: z.string().nullable(),
  applied_at: z.string(),
  status: z.enum(Status),
  resume_id: z.number().int().nullable(),
  salary: z.string().nullable(),
  work_model: z.enum(WorkModel).nullable(),
  location: z.string().nullable(),
  contacts: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const toApplicationResponse = (application: Application) => ({
  id: application.id,
  company: application.company,
  role: application.role,
  job_url: application.job_url,
  source: application.source,
  applied_at: toIsoDate(application.applied_at),
  status: application.status,
  resume_id: application.resume_id,
  salary: application.salary,
  work_model: application.work_model,
  location: application.location,
  contacts: application.contacts,
  notes: application.notes,
  created_at: application.created_at.toISOString(),
  updated_at: application.updated_at.toISOString(),
});
