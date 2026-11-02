import type { Request, Response } from "express";
import { z } from "zod";
import { Status } from "../../../../../common/infrastructure/database/prisma/generated/enums.js";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { ListStatusesUseCase } from "../../../application/usecases/list-statuses.usecase.js";
import { StatusRepositoryImpl } from "../../repositories/status.repository.js";

const statusResponseSchema = z.array(
  z.object({
    value: z.enum(Status),
    label: z.string(),
    type: z.enum(["active", "closed"]),
  }),
);

registry.registerPath({
  method: "get",
  path: "/statuses",
  tags: ["Statuses"],
  summary: "Listar status",
  description: "Retorna a lista fixa de status, na ordem das colunas do kanban.",
  responses: {
    200: {
      description: "Lista de status",
      content: { "application/json": { schema: statusResponseSchema } },
    },
  },
});

export const listStatusesController = async (_req: Request, res: Response) => {
  const listStatuses = new ListStatusesUseCase(new StatusRepositoryImpl());
  const statuses = await listStatuses.execute();

  return res.status(200).json(statuses.map(({ value, label, type }) => ({ value, label, type })));
};
