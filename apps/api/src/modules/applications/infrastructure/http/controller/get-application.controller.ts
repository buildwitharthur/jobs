import type { Request, Response } from "express";
import { z } from "zod";
import { toIsoDate } from "../../../../../common/infrastructure/http/date.js";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import {
  eventResponseSchema,
  toEventResponse,
} from "../../../../events/infrastructure/http/presenters/event.presenter.js";
import { EventPrismaRepository } from "../../../../events/infrastructure/repositories/prisma/event-prisma.repository.js";
import { ResumePrismaRepository } from "../../../../resumes/infrastructure/repositories/prisma/resume-prisma.repository.js";
import { GetApplicationUseCase } from "../../../application/usecases/get-application.usecase.js";
import { ApplicationPrismaRepository } from "../../repositories/prisma/application-prisma.repository.js";
import { applicationResponseSchema } from "../presenters/application.presenter.js";

const applicationDetailResponseSchema = applicationResponseSchema.omit({ resume_id: true }).extend({
  resume: z.object({ id: z.number().int(), name: z.string(), file_url: z.string() }).nullable(),
  events: z.array(eventResponseSchema),
});

const idSchema = z.coerce.number().int().positive();

const paramsSchema = z.object({ id: idSchema });

const getApplicationRequestSchema = z.object({ params: paramsSchema });

registry.registerPath({
  method: "get",
  path: "/applications/{id}",
  tags: ["Applications"],
  summary: "Detalhar candidatura",
  description: "Retorna a candidatura com o currículo usado e o histórico completo.",
  request: { params: paramsSchema },
  responses: {
    200: {
      description: "Candidatura",
      content: { "application/json": { schema: applicationDetailResponseSchema } },
    },
    400: { description: "Parâmetros inválidos" },
    404: { description: "Candidatura não encontrada" },
  },
});

export const getApplicationController = async (req: Request, res: Response) => {
  const parsed = dataValidation(getApplicationRequestSchema, { params: req.params });

  const getApplication = new GetApplicationUseCase(
    new ApplicationPrismaRepository(),
    new ResumePrismaRepository(),
    new EventPrismaRepository(),
  );
  const application = await getApplication.execute({ id: parsed.params.id });

  return res.status(200).json({
    id: application.id,
    company: application.company,
    role: application.role,
    job_url: application.job_url,
    source: application.source,
    applied_at: toIsoDate(application.applied_at),
    status: application.status,
    salary: application.salary,
    work_model: application.work_model,
    location: application.location,
    contacts: application.contacts,
    notes: application.notes,
    created_at: application.created_at.toISOString(),
    updated_at: application.updated_at.toISOString(),
    resume: application.resume
      ? {
          id: application.resume.id,
          name: application.resume.name,
          file_url: `/resumes/${application.resume.id}/file`,
        }
      : null,
    events: application.events.map(toEventResponse),
  });
};
