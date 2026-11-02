import type { Request, Response } from "express";
import { z } from "zod";
import { WorkModel } from "../../../../../common/infrastructure/database/prisma/generated/enums.js";
import { fromIsoDate } from "../../../../../common/infrastructure/http/date.js";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import { ResumePrismaRepository } from "../../../../resumes/infrastructure/repositories/prisma/resume-prisma.repository.js";
import { UpdateApplicationUseCase } from "../../../application/usecases/update-application.usecase.js";
import { ApplicationPrismaRepository } from "../../repositories/prisma/application-prisma.repository.js";
import {
  applicationResponseSchema,
  toApplicationResponse,
} from "../presenters/application.presenter.js";

const idSchema = z.coerce.number().int().positive();

const paramsSchema = z.object({ id: idSchema });

const updateApplicationRequestSchema = z.object({
  params: paramsSchema,
  body: z.strictObject({
    company: z.string().trim().min(1).optional(),
    role: z.string().trim().min(1).optional(),
    job_url: z.string().nullish(),
    source: z.string().nullish(),
    applied_at: z.iso.date().optional(),
    resume_id: z.number().int().positive().nullish(),
    salary: z.string().nullish(),
    work_model: z.enum(WorkModel).nullish(),
    location: z.string().nullish(),
    contacts: z.string().nullish(),
    notes: z.string().nullish(),
  }),
});

registry.registerPath({
  method: "patch",
  path: "/applications/{id}",
  tags: ["Applications"],
  summary: "Editar candidatura",
  description:
    "Atualiza parcialmente os dados. Não altera o status: use `PATCH /applications/{id}/status`.",
  request: {
    params: paramsSchema,
    body: {
      content: { "application/json": { schema: updateApplicationRequestSchema.shape.body } },
    },
  },
  responses: {
    200: {
      description: "Candidatura atualizada",
      content: { "application/json": { schema: applicationResponseSchema } },
    },
    400: { description: "Payload inválido" },
    404: { description: "Candidatura não encontrada" },
  },
});

export const updateApplicationController = async (req: Request, res: Response) => {
  const parsed = dataValidation(updateApplicationRequestSchema, {
    params: req.params,
    body: req.body,
  });

  const { applied_at, ...body } = parsed.body;

  const updateApplication = new UpdateApplicationUseCase(
    new ApplicationPrismaRepository(),
    new ResumePrismaRepository(),
  );
  const application = await updateApplication.execute({
    id: parsed.params.id,
    changes: { ...body, applied_at: applied_at ? fromIsoDate(applied_at) : undefined },
  });

  return res.status(200).json(toApplicationResponse(application));
};
