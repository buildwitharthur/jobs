import type { Request, Response } from "express";
import { z } from "zod";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import {
  Status,
  WorkModel,
} from "../../../../../common/infrastructure/database/prisma/generated/enums.js";
import { fromIsoDate, toIsoDate } from "../../../../../common/infrastructure/http/date.js";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { ApplicationPrismaRepository } from "../../../../applications/infrastructure/repositories/prisma/application-prisma.repository.js";
import { EventPrismaRepository } from "../../../../events/infrastructure/repositories/prisma/event-prisma.repository.js";
import { ResumePrismaRepository } from "../../../../resumes/infrastructure/repositories/prisma/resume-prisma.repository.js";
import { StatusRepositoryImpl } from "../../../../statuses/infrastructure/repositories/status.repository.js";
import { GetBoardUseCase } from "../../../application/usecases/get-board.usecase.js";

const boardResponseSchema = z.object({
  columns: z.array(
    z.object({
      status: z.enum(Status),
      label: z.string(),
      count: z.number().int(),
      cards: z.array(
        z.object({
          id: z.number().int(),
          company: z.string(),
          role: z.string(),
          applied_at: z.string(),
          work_model: z.enum(WorkModel).nullable(),
          resume_name: z.string().nullable(),
          last_event_at: z.string(),
        }),
      ),
    }),
  ),
});

const getBoardRequestSchema = z.object({
  query: z.strictObject({
    q: z.string().optional(),
    from: z.iso.date().optional(),
    to: z.iso.date().optional(),
    resume_id: z.coerce.number().int().positive().optional(),
  }),
});

registry.registerPath({
  method: "get",
  path: "/board",
  tags: ["Board"],
  summary: "Dados do kanban",
  description:
    "Candidaturas agrupadas por status, sempre com as 9 colunas na ordem fixa. Aceita os filtros `q`, `from`, `to` e `resume_id` da listagem.",
  request: { query: getBoardRequestSchema.shape.query },
  responses: {
    200: {
      description: "Colunas do kanban",
      content: { "application/json": { schema: boardResponseSchema } },
    },
    400: { description: "Parâmetros inválidos" },
  },
});

export const getBoardController = async (req: Request, res: Response) => {
  const parsed = dataValidation(getBoardRequestSchema, { query: req.query });

  const { from, to, ...query } = parsed.query;

  const getBoard = new GetBoardUseCase(
    new StatusRepositoryImpl(),
    new ApplicationPrismaRepository(),
    new ResumePrismaRepository(),
    new EventPrismaRepository(),
  );
  const board = await getBoard.execute({
    ...query,
    from: from ? fromIsoDate(from) : undefined,
    to: to ? fromIsoDate(to) : undefined,
  });

  return res.status(200).json({
    columns: board.columns.map(({ status, label, count, cards }) => ({
      status,
      label,
      count,
      cards: cards.map((card) => ({
        id: card.id,
        company: card.company,
        role: card.role,
        applied_at: toIsoDate(card.applied_at),
        work_model: card.work_model,
        resume_name: card.resume_name,
        last_event_at: card.last_event_at.toISOString(),
      })),
    })),
  });
};
