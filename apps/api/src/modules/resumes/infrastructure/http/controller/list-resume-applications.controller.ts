import type { Request, Response } from "express";
import { z } from "zod";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import {
  applicationResponseSchema,
  toApplicationResponse,
} from "../../../../applications/infrastructure/http/presenters/application.presenter.js";
import { ApplicationPrismaRepository } from "../../../../applications/infrastructure/repositories/prisma/application-prisma.repository.js";
import { ListResumeApplicationsUseCase } from "../../../application/usecases/list-resume-applications.usecase.js";
import { ResumePrismaRepository } from "../../repositories/prisma/resume-prisma.repository.js";

const idSchema = z.coerce.number().int().positive();

const paramsSchema = z.object({ id: idSchema });

const resumeRequestSchema = z.object({ params: paramsSchema });

registry.registerPath({
  method: "get",
  path: "/resumes/{id}/applications",
  tags: ["Resumes"],
  summary: "Candidaturas que usaram o currículo",
  request: { params: paramsSchema },
  responses: {
    200: {
      description: "Lista de candidaturas",
      content: { "application/json": { schema: z.array(applicationResponseSchema) } },
    },
    400: { description: "Parâmetros inválidos" },
    404: { description: "Currículo não encontrado" },
  },
});

export const listResumeApplicationsController = async (req: Request, res: Response) => {
  const parsed = dataValidation(resumeRequestSchema, { params: req.params });

  const listResumeApplications = new ListResumeApplicationsUseCase(
    new ResumePrismaRepository(),
    new ApplicationPrismaRepository(),
  );
  const applications = await listResumeApplications.execute({ id: parsed.params.id });

  return res.status(200).json(applications.map(toApplicationResponse));
};
