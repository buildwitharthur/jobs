import type { Request, Response } from "express";
import { z } from "zod";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import { ApplicationPrismaRepository } from "../../../../applications/infrastructure/repositories/prisma/application-prisma.repository.js";
import { UpdateEventUseCase } from "../../../application/usecases/update-event.usecase.js";
import { EventPrismaRepository } from "../../repositories/prisma/event-prisma.repository.js";
import { eventResponseSchema, toEventResponse } from "../presenters/event.presenter.js";

const idSchema = z.coerce.number().int().positive();

const eventParamsSchema = z.object({ id: idSchema, eventId: idSchema });

const updateEventRequestSchema = z.object({
  params: eventParamsSchema,
  body: z.strictObject({
    note: z.string().nullish(),
    occurred_at: z.iso.datetime().optional(),
  }),
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
