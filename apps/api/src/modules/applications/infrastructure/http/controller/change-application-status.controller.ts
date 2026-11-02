import type { Request, Response } from "express";
import { z } from "zod";
import { Status } from "../../../../../common/infrastructure/database/prisma/generated/enums.js";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import {
  eventResponseSchema,
  toEventResponse,
} from "../../../../events/infrastructure/http/presenters/event.presenter.js";
import { ChangeApplicationStatusUseCase } from "../../../application/usecases/change-application-status.usecase.js";
import { ApplicationPrismaRepository } from "../../repositories/prisma/application-prisma.repository.js";
import {
  applicationResponseSchema,
  toApplicationResponse,
} from "../presenters/application.presenter.js";

const changeStatusResponseSchema = z.object({
  application: applicationResponseSchema,
  event: eventResponseSchema.nullable(),
});

const idSchema = z.coerce.number().int().positive();

const paramsSchema = z.object({ id: idSchema });

const changeApplicationStatusRequestSchema = z.object({
  params: paramsSchema,
  body: z.strictObject({
    status: z.enum(Status),
    note: z.string().nullish(),
    occurred_at: z.iso.datetime().optional(),
  }),
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
