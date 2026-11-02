import type { Request, Response } from "express";
import { z } from "zod";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import { ReplaceResumeFileUseCase } from "../../../application/usecases/replace-resume-file.usecase.js";
import { MulterFileUploadProvider } from "../../providers/multer-file-upload.provider.js";
import { ResumePrismaRepository } from "../../repositories/prisma/resume-prisma.repository.js";
import { ResumeFileRepositoryImpl } from "../../repositories/resume-file.repository.js";
import { resumeResponseSchema, toResumeResponse } from "../presenters/resume.presenter.js";

const idSchema = z.coerce.number().int().positive();

const paramsSchema = z.object({ id: idSchema });

// Os campos de texto e o arquivo vêm do `FileUploadProvider`.
const uploadedFileSchema = z.object({
  content: z.instanceof(Buffer),
  original_name: z.string().min(1),
});

const replaceResumeFileRequestSchema = z.object({
  params: paramsSchema,
  file: uploadedFileSchema,
});

const pdfFileBodySchema = z.object({
  file: z.string().openapi({ type: "string", format: "binary" }),
});

registry.registerPath({
  method: "put",
  path: "/resumes/{id}/file",
  tags: ["Resumes"],
  summary: "Substituir o PDF",
  description: "Troca o arquivo, apaga o antigo e mantém os vínculos com as candidaturas.",
  request: {
    params: paramsSchema,
    body: {
      content: {
        "multipart/form-data": { schema: z.object({ file: pdfFileBodySchema.shape.file }) },
      },
    },
  },
  responses: {
    200: {
      description: "Currículo atualizado",
      content: { "application/json": { schema: resumeResponseSchema } },
    },
    400: { description: "Payload ou arquivo inválido" },
    404: { description: "Currículo não encontrado" },
  },
});

export const replaceResumeFileController = async (req: Request, res: Response) => {
  const upload = await new MulterFileUploadProvider().parse(req);
  const parsed = dataValidation(replaceResumeFileRequestSchema, {
    params: req.params,
    file: upload.file,
  });

  const replaceResumeFile = new ReplaceResumeFileUseCase(
    new ResumePrismaRepository(),
    new ResumeFileRepositoryImpl(),
  );
  const resume = await replaceResumeFile.execute({
    id: parsed.params.id,
    file: parsed.file,
  });

  return res.status(200).json(toResumeResponse(resume));
};
