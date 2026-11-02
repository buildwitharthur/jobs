import type { Request, Response } from "express";
import { z } from "zod";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { ListResumesUseCase } from "../../../application/usecases/list-resumes.usecase.js";
import { ResumePrismaRepository } from "../../repositories/prisma/resume-prisma.repository.js";
import { resumeResponseSchema, toResumeResponse } from "../presenters/resume.presenter.js";

registry.registerPath({
  method: "get",
  path: "/resumes",
  tags: ["Resumes"],
  summary: "Listar currículos",
  description: "Do mais recente para o mais antigo, com a contagem de candidaturas de cada um.",
  responses: {
    200: {
      description: "Lista de currículos",
      content: { "application/json": { schema: z.array(resumeResponseSchema) } },
    },
  },
});

export const listResumesController = async (_req: Request, res: Response) => {
  const listResumes = new ListResumesUseCase(new ResumePrismaRepository());
  const resumes = await listResumes.execute();

  return res.status(200).json(resumes.map(toResumeResponse));
};
