import type { StatusDefinition } from "../models/status.model.js";

export interface StatusRepository {
  /** Retorna a lista fixa de status, na ordem das colunas do kanban. */
  findAll(): Promise<StatusDefinition[]>;
}
