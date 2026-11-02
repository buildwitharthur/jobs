import type { Request, Response } from "express";
import { z } from "zod";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { dataValidation } from "../../../../../common/infrastructure/validation/zod/data-validation.js";
import { DeleteApplicationUseCase } from "../../../application/usecases/delete-application.usecase.js";
import { ApplicationPrismaRepository } from "../../repositories/prisma/application-prisma.repository.js";

const idSchema = z.coerce.number().int().positive();

const paramsSchema = z.object({ id: idSchema });

const deleteApplicationRequestSchema = z.object({ params: paramsSchema });

registry.registerPath({
  method: "delete",
  path: "/applications/{id}",
  tags: ["Applications"],
  summary: "Excluir candidatura",
  description: "Exclui a candidatura e todos os eventos dela. O currículo vinculado não é afetado.",
  request: { params: paramsSchema },
  responses: {
    204: { description: "Candidatura excluída" },
    400: { description: "Parâmetros inválidos" },
    404: { description: "Candidatura não encontrada" },
  },
});

export const deleteApplicationController = async (req: Request, res: Response) => {
  const parsed = dataValidation(deleteApplicationRequestSchema, { params: req.params });

  const deleteApplication = new DeleteApplicationUseCase(new ApplicationPrismaRepository());
  await deleteApplication.execute({ id: parsed.params.id });

  return res.status(204).send();
};
