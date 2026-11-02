import type { Request, Response } from "express";
import { z } from "zod";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import {
  applicationResponseSchema,
  toApplicationResponse,
} from "../../../../applications/infrastructure/http/controller/application.controller.js";
import { ApplicationPrismaRepository } from "../../../../applications/infrastructure/repositories/prisma/application-prisma.repository.js";
import { CreateResumeUseCase } from "../../../application/usecases/create-resume.usecase.js";
import { DeleteResumeUseCase } from "../../../application/usecases/delete-resume.usecase.js";
import { GetResumeFileUseCase } from "../../../application/usecases/get-resume-file.usecase.js";
import { GetResumeUseCase } from "../../../application/usecases/get-resume.usecase.js";
import { ListResumeApplicationsUseCase } from "../../../application/usecases/list-resume-applications.usecase.js";
import { ListResumesUseCase } from "../../../application/usecases/list-resumes.usecase.js";
import { ReplaceResumeFileUseCase } from "../../../application/usecases/replace-resume-file.usecase.js";
import { UpdateResumeUseCase } from "../../../application/usecases/update-resume.usecase.js";
import type { ResumeWithUsage } from "../../../domain/models/resume.model.js";
import { MulterFileUploadProvider } from "../../providers/multer-file-upload.provider.js";
import { ResumeFileRepositoryImpl } from "../../repositories/resume-file.repository.js";
import { ResumePrismaRepository } from "../../repositories/prisma/resume-prisma.repository.js";

const idSchema = z.coerce.number().int().positive();
const paramsSchema = z.object({ id: idSchema });

const resumeResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
  file_name: z.string(),
  file_url: z.string(),
  applications_count: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});

const toResumeResponse = (resume: ResumeWithUsage) => ({
  id: resume.id,
  name: resume.name,
  description: resume.description,
  file_name: resume.file_name,
  file_url: `/resumes/${resume.id}/file`,
  applications_count: resume.applications_count,
  created_at: resume.created_at.toISOString(),
  updated_at: resume.updated_at.toISOString(),
});

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

const replaceResumeFileRequestSchema = z.object({
  params: paramsSchema,
  file: uploadedFileSchema,
});

const updateResumeRequestSchema = z.object({
  params: paramsSchema,
  body: z.strictObject({
    name: z.string().trim().min(1).optional(),
    description: z.string().nullish(),
  }),
});

const resumeRequestSchema = z.object({ params: paramsSchema });

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

export const listResumesController = async (_req: Request, res: Response) => {
  const listResumes = new ListResumesUseCase(new ResumePrismaRepository());
  const resumes = await listResumes.execute();

  return res.status(200).json(resumes.map(toResumeResponse));
};

export const getResumeController = async (req: Request, res: Response) => {
  const parsed = dataValidation(resumeRequestSchema, { params: req.params });

  const getResume = new GetResumeUseCase(new ResumePrismaRepository());
  const resume = await getResume.execute({ id: parsed.params.id });

  return res.status(200).json(toResumeResponse(resume));
};

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

export const listResumeApplicationsController = async (req: Request, res: Response) => {
  const parsed = dataValidation(resumeRequestSchema, { params: req.params });

  const listResumeApplications = new ListResumeApplicationsUseCase(
    new ResumePrismaRepository(),
    new ApplicationPrismaRepository(),
  );
  const applications = await listResumeApplications.execute({ id: parsed.params.id });

  return res.status(200).json(applications.map(toApplicationResponse));
};

export const updateResumeController = async (req: Request, res: Response) => {
  const parsed = dataValidation(updateResumeRequestSchema, { params: req.params, body: req.body });

  const updateResume = new UpdateResumeUseCase(new ResumePrismaRepository());
  const resume = await updateResume.execute({
    id: parsed.params.id,
    changes: parsed.body,
  });

  return res.status(200).json(toResumeResponse(resume));
};

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

export const deleteResumeController = async (req: Request, res: Response) => {
  const parsed = dataValidation(resumeRequestSchema, { params: req.params });

  const deleteResume = new DeleteResumeUseCase(
    new ResumePrismaRepository(),
    new ResumeFileRepositoryImpl(),
  );
  await deleteResume.execute({ id: parsed.params.id });

  return res.status(204).send();
};
