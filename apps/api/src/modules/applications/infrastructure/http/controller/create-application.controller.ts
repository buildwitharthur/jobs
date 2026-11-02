import type { Request, Response } from "express";
import { z } from "zod";
import {
  Status,
  WorkModel,
} from "../../../../../common/infrastructure/database/prisma/generated/enums.js";
import { fromIsoDate } from "../../../../../common/infrastructure/http/date.js";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import { ResumePrismaRepository } from "../../../../resumes/infrastructure/repositories/prisma/resume-prisma.repository.js";
import { CreateApplicationUseCase } from "../../../application/usecases/create-application.usecase.js";
import { ApplicationPrismaRepository } from "../../repositories/prisma/application-prisma.repository.js";
import {
  applicationResponseSchema,
  toApplicationResponse,
} from "../presenters/application.presenter.js";

const createApplicationRequestSchema = z.object({
  body: z.strictObject({
    company: z.string().trim().min(1),
    role: z.string().trim().min(1),
    job_url: z.string().nullish(),
    source: z.string().nullish(),
    applied_at: z.iso.date().optional(),
    status: z.enum(Status).optional(),
    resume_id: z.number().int().positive().nullish(),
    salary: z.string().nullish(),
    work_model: z.enum(WorkModel).nullish(),
    location: z.string().nullish(),
    contacts: z.string().nullish(),
    notes: z.string().nullish(),
  }),
});

registry.registerPath({
  method: "post",
  path: "/applications",
  tags: ["Applications"],
  summary: "Criar candidatura",
  description:
    "Cria a candidatura e gera o evento `created` no histórico. `status` padrão: `applied`; `applied_at` padrão: hoje.",
  request: {
    body: {
      content: { "application/json": { schema: createApplicationRequestSchema.shape.body } },
    },
  },
  responses: {
    201: {
      description: "Candidatura criada",
      content: { "application/json": { schema: applicationResponseSchema } },
    },
    400: { description: "Payload inválido" },
  },
});

export const createApplicationController = async (req: Request, res: Response) => {
  const parsed = dataValidation(createApplicationRequestSchema, { body: req.body });

  const { applied_at, ...body } = parsed.body;

  const createApplication = new CreateApplicationUseCase(
    new ApplicationPrismaRepository(),
    new ResumePrismaRepository(),
  );
  const application = await createApplication.execute({
    ...body,
    applied_at: applied_at ? fromIsoDate(applied_at) : undefined,
  });

  return res.status(201).json(toApplicationResponse(application));
};
