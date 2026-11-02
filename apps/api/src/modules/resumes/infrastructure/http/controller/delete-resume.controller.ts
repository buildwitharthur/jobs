import type { Request, Response } from "express";
import { z } from "zod";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import { DeleteResumeUseCase } from "../../../application/usecases/delete-resume.usecase.js";
import { ResumePrismaRepository } from "../../repositories/prisma/resume-prisma.repository.js";
import { ResumeFileRepositoryImpl } from "../../repositories/resume-file.repository.js";

const idSchema = z.coerce.number().int().positive();

const paramsSchema = z.object({ id: idSchema });

const resumeRequestSchema = z.object({ params: paramsSchema });

registry.registerPath({
  method: "delete",
  path: "/resumes/{id}",
  tags: ["Resumes"],
  summary: "Excluir currículo",
  description: "Só exclui currículos que não estão vinculados a nenhuma candidatura.",
  request: { params: paramsSchema },
  responses: {
    204: { description: "Currículo excluído" },
    400: { description: "Parâmetros inválidos" },
    404: { description: "Currículo não encontrado" },
    409: { description: "Currículo em uso por alguma candidatura" },
  },
});

export const deleteResumeController = async (req: Request, res: Response) => {
  const parsed = dataValidation(resumeRequestSchema, { params: req.params });

  const deleteResume = new DeleteResumeUseCase(
    new ResumePrismaRepository(),
    new ResumeFileRepositoryImpl(),
  );
  await deleteResume.execute({ id: parsed.params.id });

  return res.status(204).send();
};
