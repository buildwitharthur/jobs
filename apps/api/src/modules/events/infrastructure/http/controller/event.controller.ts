import type { Request, Response } from "express";
import { z } from "zod";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import {
  EventType,
  Status,
} from "../../../../../common/infrastructure/database/prisma/generated/enums.js";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { ApplicationPrismaRepository } from "../../../../applications/infrastructure/repositories/prisma/application-prisma.repository.js";
import { CreateEventUseCase } from "../../../application/usecases/create-event.usecase.js";
import { DeleteEventUseCase } from "../../../application/usecases/delete-event.usecase.js";
import { ListEventsUseCase } from "../../../application/usecases/list-events.usecase.js";
import { UpdateEventUseCase } from "../../../application/usecases/update-event.usecase.js";
import type { ApplicationEvent } from "../../../domain/models/event.model.js";
import { EventPrismaRepository } from "../../repositories/prisma/event-prisma.repository.js";

const idSchema = z.coerce.number().int().positive();

export const eventResponseSchema = z.object({
  id: z.number().int(),
  application_id: z.number().int(),
  type: z.enum(EventType),
  from_status: z.enum(Status).nullable(),
  to_status: z.enum(Status).nullable(),
  note: z.string().nullable(),
  occurred_at: z.string(),
  created_at: z.string(),
});

export const toEventResponse = (event: ApplicationEvent) => ({
  id: event.id,
  application_id: event.application_id,
  type: event.type,
  from_status: event.from_status,
  to_status: event.to_status,
  note: event.note,
  occurred_at: event.occurred_at.toISOString(),
  created_at: event.created_at.toISOString(),
});

const applicationParamsSchema = z.object({ id: idSchema });
const eventParamsSchema = z.object({ id: idSchema, eventId: idSchema });

const listEventsRequestSchema = z.object({ params: applicationParamsSchema });

const createEventRequestSchema = z.object({
  params: applicationParamsSchema,
  body: z.strictObject({
    note: z.string().trim().min(1),
    occurred_at: z.iso.datetime().optional(),
  }),
});

const updateEventRequestSchema = z.object({
  params: eventParamsSchema,
  body: z.strictObject({
    note: z.string().nullish(),
    occurred_at: z.iso.datetime().optional(),
  }),
});

const deleteEventRequestSchema = z.object({ params: eventParamsSchema });

registry.registerPath({
  method: "get",
  path: "/applications/{id}/events",
  tags: ["Events"],
  summary: "Listar histórico",
  description: "Eventos da candidatura, do mais recente para o mais antigo.",
  request: { params: applicationParamsSchema },
  responses: {
    200: {
      description: "Lista de eventos",
      content: { "application/json": { schema: z.array(eventResponseSchema) } },
    },
    404: { description: "Candidatura não encontrada" },
  },
});

registry.registerPath({
  method: "post",
  path: "/applications/{id}/events",
  tags: ["Events"],
  summary: "Adicionar evento manual",
  description: "Registra algo que aconteceu no processo sem mudar o status.",
  request: {
    params: applicationParamsSchema,
    body: { content: { "application/json": { schema: createEventRequestSchema.shape.body } } },
  },
  responses: {
    201: {
      description: "Evento criado",
      content: { "application/json": { schema: eventResponseSchema } },
    },
    400: { description: "Payload inválido" },
    404: { description: "Candidatura não encontrada" },
  },
});

registry.registerPath({
  method: "patch",
  path: "/applications/{id}/events/{eventId}",
  tags: ["Events"],
  summary: "Editar evento",
  description: "Corrige a nota ou a data de um evento.",
  request: {
    params: eventParamsSchema,
    body: { content: { "application/json": { schema: updateEventRequestSchema.shape.body } } },
  },
  responses: {
    200: {
      description: "Evento atualizado",
      content: { "application/json": { schema: eventResponseSchema } },
    },
    400: { description: "Payload inválido" },
    404: { description: "Candidatura ou evento não encontrado" },
  },
});

registry.registerPath({
  method: "delete",
  path: "/applications/{id}/events/{eventId}",
  tags: ["Events"],
  summary: "Excluir evento",
  description: "O evento de criação não pode ser excluído.",
  request: { params: eventParamsSchema },
  responses: {
    204: { description: "Evento excluído" },
    400: { description: "Evento de criação não pode ser excluído" },
    404: { description: "Candidatura ou evento não encontrado" },
  },
});

export const listEventsController = async (req: Request, res: Response) => {
  const parsed = dataValidation(listEventsRequestSchema, { params: req.params });

  const listEvents = new ListEventsUseCase(
    new EventPrismaRepository(),
    new ApplicationPrismaRepository(),
  );
  const events = await listEvents.execute({ application_id: parsed.params.id });

  return res.status(200).json(events.map(toEventResponse));
};

export const createEventController = async (req: Request, res: Response) => {
  const parsed = dataValidation(createEventRequestSchema, { params: req.params, body: req.body });

  const { note, occurred_at } = parsed.body;

  const createEvent = new CreateEventUseCase(
    new EventPrismaRepository(),
    new ApplicationPrismaRepository(),
  );
  const event = await createEvent.execute({
    application_id: parsed.params.id,
    note,
    occurred_at: occurred_at ? new Date(occurred_at) : undefined,
  });

  return res.status(201).json(toEventResponse(event));
};

export const updateEventController = async (req: Request, res: Response) => {
  const parsed = dataValidation(updateEventRequestSchema, { params: req.params, body: req.body });

  const { note, occurred_at } = parsed.body;

  const updateEvent = new UpdateEventUseCase(
    new EventPrismaRepository(),
    new ApplicationPrismaRepository(),
  );
  const event = await updateEvent.execute({
    application_id: parsed.params.id,
    event_id: parsed.params.eventId,
    note,
    occurred_at: occurred_at ? new Date(occurred_at) : undefined,
  });

  return res.status(200).json(toEventResponse(event));
};

export const deleteEventController = async (req: Request, res: Response) => {
  const parsed = dataValidation(deleteEventRequestSchema, { params: req.params });

  const deleteEvent = new DeleteEventUseCase(
    new EventPrismaRepository(),
    new ApplicationPrismaRepository(),
  );
  await deleteEvent.execute({
    application_id: parsed.params.id,
    event_id: parsed.params.eventId,
  });

  return res.status(204).send();
};
