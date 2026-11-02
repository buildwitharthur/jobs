import type { Request, Response } from "express";
import { z } from "zod";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import { ApplicationPrismaRepository } from "../../../../applications/infrastructure/repositories/prisma/application-prisma.repository.js";
import { DeleteEventUseCase } from "../../../application/usecases/delete-event.usecase.js";
import { EventPrismaRepository } from "../../repositories/prisma/event-prisma.repository.js";

const idSchema = z.coerce.number().int().positive();

const eventParamsSchema = z.object({ id: idSchema, eventId: idSchema });

const deleteEventRequestSchema = z.object({ params: eventParamsSchema });

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
