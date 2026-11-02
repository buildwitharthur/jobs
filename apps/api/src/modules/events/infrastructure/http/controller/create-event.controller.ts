import type { Request, Response } from "express";
import { z } from "zod";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import { ApplicationPrismaRepository } from "../../../../applications/infrastructure/repositories/prisma/application-prisma.repository.js";
import { CreateEventUseCase } from "../../../application/usecases/create-event.usecase.js";
import { EventPrismaRepository } from "../../repositories/prisma/event-prisma.repository.js";
import { eventResponseSchema, toEventResponse } from "../presenters/event.presenter.js";

const idSchema = z.coerce.number().int().positive();

const applicationParamsSchema = z.object({ id: idSchema });

const createEventRequestSchema = z.object({
  params: applicationParamsSchema,
  body: z.strictObject({
    note: z.string().trim().min(1),
    occurred_at: z.iso.datetime().optional(),
  }),
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
