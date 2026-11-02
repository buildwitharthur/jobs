import type { Request, Response } from "express";
import { z } from "zod";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import { UpdateResumeUseCase } from "../../../application/usecases/update-resume.usecase.js";
import { ResumePrismaRepository } from "../../repositories/prisma/resume-prisma.repository.js";
import { resumeResponseSchema, toResumeResponse } from "../presenters/resume.presenter.js";

const idSchema = z.coerce.number().int().positive();

const paramsSchema = z.object({ id: idSchema });

const updateResumeRequestSchema = z.object({
  params: paramsSchema,
  body: z.strictObject({
    name: z.string().trim().min(1).optional(),
    description: z.string().nullish(),
  }),
});

registry.registerPath({
  method: "patch",
  path: "/resumes/{id}",
  tags: ["Resumes"],
  summary: "Editar dados do currículo",
  description: "Altera nome e descrição. Não altera o arquivo.",
  request: {
    params: paramsSchema,
    body: { content: { "application/json": { schema: updateResumeRequestSchema.shape.body } } },
  },
  responses: {
    200: {
      description: "Currículo atualizado",
      content: { "application/json": { schema: resumeResponseSchema } },
    },
    400: { description: "Payload inválido" },
    404: { description: "Currículo não encontrado" },
  },
});

export const updateResumeController = async (req: Request, res: Response) => {
  const parsed = dataValidation(updateResumeRequestSchema, { params: req.params, body: req.body });

  const updateResume = new UpdateResumeUseCase(new ResumePrismaRepository());
  const resume = await updateResume.execute({
    id: parsed.params.id,
    changes: parsed.body,
  });

  return res.status(200).json(toResumeResponse(resume));
};
