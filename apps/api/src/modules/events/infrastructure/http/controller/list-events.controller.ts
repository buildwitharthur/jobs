import type { Request, Response } from "express";
import { z } from "zod";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import { ApplicationPrismaRepository } from "../../../../applications/infrastructure/repositories/prisma/application-prisma.repository.js";
import { ListEventsUseCase } from "../../../application/usecases/list-events.usecase.js";
import { EventPrismaRepository } from "../../repositories/prisma/event-prisma.repository.js";
import { eventResponseSchema, toEventResponse } from "../presenters/event.presenter.js";

const idSchema = z.coerce.number().int().positive();

const applicationParamsSchema = z.object({ id: idSchema });

const listEventsRequestSchema = z.object({ params: applicationParamsSchema });

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

export const listEventsController = async (req: Request, res: Response) => {
  const parsed = dataValidation(listEventsRequestSchema, { params: req.params });

  const listEvents = new ListEventsUseCase(
    new EventPrismaRepository(),
    new ApplicationPrismaRepository(),
  );
  const events = await listEvents.execute({ application_id: parsed.params.id });

  return res.status(200).json(events.map(toEventResponse));
};
