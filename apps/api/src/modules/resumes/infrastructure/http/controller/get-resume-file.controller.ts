import type { Request, Response } from "express";
import { z } from "zod";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import { GetResumeFileUseCase } from "../../../application/usecases/get-resume-file.usecase.js";
import { ResumePrismaRepository } from "../../repositories/prisma/resume-prisma.repository.js";
import { ResumeFileRepositoryImpl } from "../../repositories/resume-file.repository.js";

const idSchema = z.coerce.number().int().positive();

const paramsSchema = z.object({ id: idSchema });

const resumeRequestSchema = z.object({ params: paramsSchema });

const pdfFileBodySchema = z.object({
  file: z.string().openapi({ type: "string", format: "binary" }),
});

registry.registerPath({
  method: "get",
  path: "/resumes/{id}/file",
  tags: ["Resumes"],
  summary: "Baixar ou visualizar o PDF",
  request: { params: paramsSchema },
  responses: {
    200: {
      description: "Arquivo PDF",
      content: { "application/pdf": { schema: pdfFileBodySchema.shape.file } },
    },
    400: { description: "Parâmetros inválidos" },
    404: { description: "Currículo ou arquivo não encontrado" },
  },
});

export const getResumeFileController = async (req: Request, res: Response) => {
  const parsed = dataValidation(resumeRequestSchema, { params: req.params });

  const getResumeFile = new GetResumeFileUseCase(
    new ResumePrismaRepository(),
    new ResumeFileRepositoryImpl(),
  );
  const { file_path, file_name } = await getResumeFile.execute({ id: parsed.params.id });

  // O cabeçalho só aceita ASCII: `filename` leva uma versão simplificada e `filename*` o nome original.
  const asciiName = file_name.replace(/[^\x20-\x7e]|["\\]/g, "_");
  res.setHeader(
    "Content-Disposition",
    `inline; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(file_name)}`,
  );
  res.type("application/pdf");

  return res.sendFile(file_path);
};
