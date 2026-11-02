import type { Request, Response } from "express";
import { z } from "zod";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import {
  Status,
  WorkModel,
} from "../../../../../common/infrastructure/database/prisma/generated/enums.js";
import { fromIsoDate, toIsoDate } from "../../../../../common/infrastructure/http/date.js";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import {
  eventResponseSchema,
  toEventResponse,
} from "../../../../events/infrastructure/http/controller/event.controller.js";
import { EventPrismaRepository } from "../../../../events/infrastructure/repositories/prisma/event-prisma.repository.js";
import { ResumePrismaRepository } from "../../../../resumes/infrastructure/repositories/prisma/resume-prisma.repository.js";
import { ChangeApplicationStatusUseCase } from "../../../application/usecases/change-application-status.usecase.js";
import { CreateApplicationUseCase } from "../../../application/usecases/create-application.usecase.js";
import { DeleteApplicationUseCase } from "../../../application/usecases/delete-application.usecase.js";
import { GetApplicationUseCase } from "../../../application/usecases/get-application.usecase.js";
import { ListApplicationsUseCase } from "../../../application/usecases/list-applications.usecase.js";
import { UpdateApplicationUseCase } from "../../../application/usecases/update-application.usecase.js";
import type { Application } from "../../../domain/models/application.model.js";
import { ApplicationPrismaRepository } from "../../repositories/prisma/application-prisma.repository.js";

const idSchema = z.coerce.number().int().positive();
const statusValues: string[] = Object.values(Status);

export const applicationResponseSchema = z.object({
  id: z.number().int(),
  company: z.string(),
  role: z.string(),
  job_url: z.string().nullable(),
  source: z.string().nullable(),
  applied_at: z.string(),
  status: z.enum(Status),
  resume_id: z.number().int().nullable(),
  salary: z.string().nullable(),
  work_model: z.enum(WorkModel).nullable(),
  location: z.string().nullable(),
  contacts: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const toApplicationResponse = (application: Application) => ({
  id: application.id,
  company: application.company,
  role: application.role,
  job_url: application.job_url,
  source: application.source,
  applied_at: toIsoDate(application.applied_at),
  status: application.status,
  resume_id: application.resume_id,
  salary: application.salary,
  work_model: application.work_model,
  location: application.location,
  contacts: application.contacts,
  notes: application.notes,
  created_at: application.created_at.toISOString(),
  updated_at: application.updated_at.toISOString(),
});

const applicationDetailResponseSchema = applicationResponseSchema.omit({ resume_id: true }).extend({
  resume: z.object({ id: z.number().int(), name: z.string(), file_url: z.string() }).nullable(),
  events: z.array(eventResponseSchema),
});

const changeStatusResponseSchema = z.object({
  application: applicationResponseSchema,
  event: eventResponseSchema.nullable(),
});

const paramsSchema = z.object({ id: idSchema });

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

const listApplicationsRequestSchema = z.object({
  query: z.strictObject({
    status: z
      .string()
      .refine((value) => value.split(",").every((item) => statusValues.includes(item.trim())), {
        message: "Status inválido",
      })
      .optional(),
    q: z.string().optional(),
    from: z.iso.date().optional(),
    to: z.iso.date().optional(),
    resume_id: idSchema.optional(),
    sort: z
      .enum(["applied_at", "-applied_at", "updated_at", "-updated_at", "company", "-company"])
      .optional(),
  }),
});

const getApplicationRequestSchema = z.object({ params: paramsSchema });

const updateApplicationRequestSchema = z.object({
  params: paramsSchema,
  body: z.strictObject({
    company: z.string().trim().min(1).optional(),
    role: z.string().trim().min(1).optional(),
    job_url: z.string().nullish(),
    source: z.string().nullish(),
    applied_at: z.iso.date().optional(),
    resume_id: z.number().int().positive().nullish(),
    salary: z.string().nullish(),
    work_model: z.enum(WorkModel).nullish(),
    location: z.string().nullish(),
    contacts: z.string().nullish(),
    notes: z.string().nullish(),
  }),
});

const changeApplicationStatusRequestSchema = z.object({
  params: paramsSchema,
  body: z.strictObject({
    status: z.enum(Status),
    note: z.string().nullish(),
    occurred_at: z.iso.datetime().optional(),
  }),
});

const deleteApplicationRequestSchema = z.object({ params: paramsSchema });

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

registry.registerPath({
  method: "get",
  path: "/applications",
  tags: ["Applications"],
  summary: "Listar candidaturas",
  description:
    "Aceita filtros por status (vários separados por vírgula), busca em empresa e cargo, intervalo de datas e currículo. Ordenação padrão: `-applied_at`.",
  request: { query: listApplicationsRequestSchema.shape.query },
  responses: {
    200: {
      description: "Lista de candidaturas",
      content: { "application/json": { schema: z.array(applicationResponseSchema) } },
    },
    400: { description: "Parâmetros inválidos" },
  },
});

registry.registerPath({
  method: "get",
  path: "/applications/{id}",
  tags: ["Applications"],
  summary: "Detalhar candidatura",
  description: "Retorna a candidatura com o currículo usado e o histórico completo.",
  request: { params: paramsSchema },
  responses: {
    200: {
      description: "Candidatura",
      content: { "application/json": { schema: applicationDetailResponseSchema } },
    },
    400: { description: "Parâmetros inválidos" },
    404: { description: "Candidatura não encontrada" },
  },
});

registry.registerPath({
  method: "patch",
  path: "/applications/{id}",
  tags: ["Applications"],
  summary: "Editar candidatura",
  description:
    "Atualiza parcialmente os dados. Não altera o status: use `PATCH /applications/{id}/status`.",
  request: {
    params: paramsSchema,
    body: {
      content: { "application/json": { schema: updateApplicationRequestSchema.shape.body } },
    },
  },
  responses: {
    200: {
      description: "Candidatura atualizada",
      content: { "application/json": { schema: applicationResponseSchema } },
    },
    400: { description: "Payload inválido" },
    404: { description: "Candidatura não encontrada" },
  },
});

registry.registerPath({
  method: "patch",
  path: "/applications/{id}/status",
  tags: ["Applications"],
  summary: "Mudar status",
  description:
    "Muda o status e registra um evento `status_change`. Se o status enviado já for o atual, nada muda e `event` vem `null`.",
  request: {
    params: paramsSchema,
    body: {
      content: {
        "application/json": { schema: changeApplicationStatusRequestSchema.shape.body },
      },
    },
  },
  responses: {
    200: {
      description: "Status atualizado",
      content: { "application/json": { schema: changeStatusResponseSchema } },
    },
    400: { description: "Payload inválido" },
    404: { description: "Candidatura não encontrada" },
  },
});

registry.registerPath({
  method: "delete",
  path: "/applications/{id}",
  tags: ["Applications"],
  summary: "Excluir candidatura",
  description: "Exclui a candidatura e todos os eventos dela. O currículo vinculado não é afetado.",
  request: { params: paramsSchema },
  responses: {
    204: { description: "Candidatura excluída" },
    400: { description: "Parâmetros inválidos" },
    404: { description: "Candidatura não encontrada" },
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

export const listApplicationsController = async (req: Request, res: Response) => {
  const parsed = dataValidation(listApplicationsRequestSchema, { query: req.query });

  const { status, from, to, ...query } = parsed.query;

  const listApplications = new ListApplicationsUseCase(new ApplicationPrismaRepository());
  const applications = await listApplications.execute({
    ...query,
    status: status?.split(",").map((item) => item.trim() as Status),
    from: from ? fromIsoDate(from) : undefined,
    to: to ? fromIsoDate(to) : undefined,
  });

  return res.status(200).json(applications.map(toApplicationResponse));
};

export const getApplicationController = async (req: Request, res: Response) => {
  const parsed = dataValidation(getApplicationRequestSchema, { params: req.params });

  const getApplication = new GetApplicationUseCase(
    new ApplicationPrismaRepository(),
    new ResumePrismaRepository(),
    new EventPrismaRepository(),
  );
  const application = await getApplication.execute({ id: parsed.params.id });

  return res.status(200).json({
    id: application.id,
    company: application.company,
    role: application.role,
    job_url: application.job_url,
    source: application.source,
    applied_at: toIsoDate(application.applied_at),
    status: application.status,
    salary: application.salary,
    work_model: application.work_model,
    location: application.location,
    contacts: application.contacts,
    notes: application.notes,
    created_at: application.created_at.toISOString(),
    updated_at: application.updated_at.toISOString(),
    resume: application.resume
      ? {
          id: application.resume.id,
          name: application.resume.name,
          file_url: `/resumes/${application.resume.id}/file`,
        }
      : null,
    events: application.events.map(toEventResponse),
  });
};

export const updateApplicationController = async (req: Request, res: Response) => {
  const parsed = dataValidation(updateApplicationRequestSchema, {
    params: req.params,
    body: req.body,
  });

  const { applied_at, ...body } = parsed.body;

  const updateApplication = new UpdateApplicationUseCase(
    new ApplicationPrismaRepository(),
    new ResumePrismaRepository(),
  );
  const application = await updateApplication.execute({
    id: parsed.params.id,
    changes: { ...body, applied_at: applied_at ? fromIsoDate(applied_at) : undefined },
  });

  return res.status(200).json(toApplicationResponse(application));
};

export const changeApplicationStatusController = async (req: Request, res: Response) => {
  const parsed = dataValidation(changeApplicationStatusRequestSchema, {
    params: req.params,
    body: req.body,
  });

  const { status, note, occurred_at } = parsed.body;

  const changeApplicationStatus = new ChangeApplicationStatusUseCase(
    new ApplicationPrismaRepository(),
  );
  const result = await changeApplicationStatus.execute({
    id: parsed.params.id,
    status,
    note,
    occurred_at: occurred_at ? new Date(occurred_at) : undefined,
  });

  return res.status(200).json({
    application: toApplicationResponse(result.application),
    event: result.event ? toEventResponse(result.event) : null,
  });
};

export const deleteApplicationController = async (req: Request, res: Response) => {
  const parsed = dataValidation(deleteApplicationRequestSchema, { params: req.params });

  const deleteApplication = new DeleteApplicationUseCase(new ApplicationPrismaRepository());
  await deleteApplication.execute({ id: parsed.params.id });

  return res.status(204).send();
};
