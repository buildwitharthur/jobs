import { Status } from "../../../../common/infrastructure/database/prisma/generated/enums.js";
import type { StatusDefinition, StatusType } from "../../domain/models/status.model.js";
import type { StatusRepository } from "../../domain/repositories/status.repository.js";

// Tipado por Record<Status, ...>: se o enum do schema.prisma ganhar ou perder um
// valor, o TypeScript acusa erro aqui até este mapa ser atualizado.
const STATUS_METADATA: Record<Status, { label: string; type: StatusType }> = {
  applied: { label: "Inscrito", type: "active" },
  screening: { label: "Em análise / Triagem", type: "active" },
  interview: { label: "Entrevista", type: "active" },
  technical_test: { label: "Teste técnico / Case", type: "active" },
  offer: { label: "Proposta", type: "active" },
  accepted: { label: "Aprovado / Aceito", type: "closed" },
  rejected: { label: "Reprovado", type: "closed" },
  withdrawn: { label: "Desisti", type: "closed" },
  no_response: { label: "Sem retorno", type: "closed" },
};

export class StatusRepositoryImpl implements StatusRepository {
  /**
   * Os status são uma lista fixa (sem tabela), então não há consulta ao banco.
   * A ordem vem do enum `Status` do schema.prisma, que é a ordem das colunas do kanban.
   */
  async findAll(): Promise<StatusDefinition[]> {
    return Object.values(Status).map((value) => ({ value, ...STATUS_METADATA[value] }));
  }
}
