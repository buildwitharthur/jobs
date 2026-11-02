import type { Request, Response } from "express";
import { z } from "zod";
import {
  EventType,
  Status,
} from "../../../../../common/infrastructure/database/prisma/generated/enums.js";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { ApplicationPrismaRepository } from "../../../../applications/infrastructure/repositories/prisma/application-prisma.repository.js";
import { EventPrismaRepository } from "../../../../events/infrastructure/repositories/prisma/event-prisma.repository.js";
import { StatusRepositoryImpl } from "../../../../statuses/infrastructure/repositories/status.repository.js";
import { GetDashboardUseCase } from "../../../application/usecases/get-dashboard.usecase.js";

const dashboardResponseSchema = z.object({
  total: z.number().int(),
  active: z.number().int(),
  closed: z.number().int(),
  by_status: z.record(z.enum(Status), z.number().int()),
  applied_last_30_days: z.number().int(),
  recent_events: z.array(
    z.object({
      id: z.number().int(),
      application_id: z.number().int(),
      company: z.string(),
      role: z.string(),
      type: z.enum(EventType),
      to_status: z.enum(Status).nullable(),
      occurred_at: z.string(),
    }),
  ),
});

registry.registerPath({
  method: "get",
  path: "/dashboard",
  tags: ["Dashboard"],
  summary: "Resumo geral",
  description:
    "Total de candidaturas, ativas e encerradas, contagem por status, candidaturas dos últimos 30 dias e os 10 eventos mais recentes.",
  responses: {
    200: {
      description: "Resumo geral",
      content: { "application/json": { schema: dashboardResponseSchema } },
    },
  },
});

export const getDashboardController = async (_req: Request, res: Response) => {
  const getDashboard = new GetDashboardUseCase(
    new StatusRepositoryImpl(),
    new ApplicationPrismaRepository(),
    new EventPrismaRepository(),
  );
  const dashboard = await getDashboard.execute();

  return res.status(200).json({
    total: dashboard.total,
    active: dashboard.active,
    closed: dashboard.closed,
    by_status: dashboard.by_status,
    applied_last_30_days: dashboard.applied_last_30_days,
    recent_events: dashboard.recent_events.map((event) => ({
      id: event.id,
      application_id: event.application_id,
      company: event.company,
      role: event.role,
      type: event.type,
      to_status: event.to_status,
      occurred_at: event.occurred_at.toISOString(),
    })),
  });
};
