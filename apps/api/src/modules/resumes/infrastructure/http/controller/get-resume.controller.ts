import type { Request, Response } from "express";
import { z } from "zod";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import { GetResumeUseCase } from "../../../application/usecases/get-resume.usecase.js";
import { ResumePrismaRepository } from "../../repositories/prisma/resume-prisma.repository.js";
import { resumeResponseSchema, toResumeResponse } from "../presenters/resume.presenter.js";

const idSchema = z.coerce.number().int().positive();

const paramsSchema = z.object({ id: idSchema });

const resumeRequestSchema = z.object({ params: paramsSchema });

registry.registerPath({
  method: "get",
  path: "/resumes/{id}",
  tags: ["Resumes"],
  summary: "Detalhar currículo",
  request: { params: paramsSchema },
  responses: {
    200: {
      description: "Currículo",
      content: { "application/json": { schema: resumeResponseSchema } },
    },
    400: { description: "Parâmetros inválidos" },
    404: { description: "Currículo não encontrado" },
  },
});

export const getResumeController = async (req: Request, res: Response) => {
  const parsed = dataValidation(resumeRequestSchema, { params: req.params });

  const getResume = new GetResumeUseCase(new ResumePrismaRepository());
  const resume = await getResume.execute({ id: parsed.params.id });

  return res.status(200).json(toResumeResponse(resume));
};
