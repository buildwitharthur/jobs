import type { Request, Response } from "express";
import { z } from "zod";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import { CreateResumeUseCase } from "../../../application/usecases/create-resume.usecase.js";
import { MulterFileUploadProvider } from "../../providers/multer-file-upload.provider.js";
import { ResumePrismaRepository } from "../../repositories/prisma/resume-prisma.repository.js";
import { ResumeFileRepositoryImpl } from "../../repositories/resume-file.repository.js";
import { resumeResponseSchema, toResumeResponse } from "../presenters/resume.presenter.js";

// Os campos de texto e o arquivo vêm do `FileUploadProvider`.
const uploadedFileSchema = z.object({
  content: z.instanceof(Buffer),
  original_name: z.string().min(1),
});

const createResumeRequestSchema = z.object({
  body: z.strictObject({
    name: z.string().trim().min(1),
    description: z.string().nullish(),
  }),
  file: uploadedFileSchema,
});

const pdfFileBodySchema = z.object({
  file: z.string().openapi({ type: "string", format: "binary" }),
});

registry.registerPath({
  method: "post",
  path: "/resumes",
  tags: ["Resumes"],
  summary: "Cadastrar currículo",
  description: "Envia o PDF e guarda numa pasta dentro do projeto.",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            name: z.string(),
            description: z.string().optional(),
            file: pdfFileBodySchema.shape.file,
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Currículo criado",
      content: { "application/json": { schema: resumeResponseSchema } },
    },
    400: { description: "Payload ou arquivo inválido" },
  },
});

export const createResumeController = async (req: Request, res: Response) => {
  const upload = await new MulterFileUploadProvider().parse(req);
  const parsed = dataValidation(createResumeRequestSchema, {
    body: upload.fields,
    file: upload.file,
  });

  const { name, description } = parsed.body;

  const createResume = new CreateResumeUseCase(
    new ResumePrismaRepository(),
    new ResumeFileRepositoryImpl(),
  );
  const resume = await createResume.execute({
    name,
    description,
    file: parsed.file,
  });

  return res.status(201).json(toResumeResponse(resume));
};
