import type { Request, Response } from "express";
import { z } from "zod";
import { Status } from "../../../../../common/infrastructure/database/prisma/generated/enums.js";
import { fromIsoDate } from "../../../../../common/infrastructure/http/date.js";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import { ListApplicationsUseCase } from "../../../application/usecases/list-applications.usecase.js";
import { ApplicationPrismaRepository } from "../../repositories/prisma/application-prisma.repository.js";
import {
  applicationResponseSchema,
  toApplicationResponse,
} from "../presenters/application.presenter.js";

const idSchema = z.coerce.number().int().positive();

const statusValues: string[] = Object.values(Status);

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
