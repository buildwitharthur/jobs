import type {
  ApplicationEvent,
  NewApplicationEvent,
} from "../../../events/domain/models/event.model.js";
import type { Status } from "../../../statuses/domain/models/status.model.js";
import type { Application } from "../models/application.model.js";

export type ApplicationSort =
  "applied_at" | "-applied_at" | "updated_at" | "-updated_at" | "company" | "-company";

export interface ApplicationFilters {
  status?: Status[];
  /** Busca em `company` e `role`, sem diferenciar maiúsculas de minúsculas. */
  q?: string;
  from?: Date;
  to?: Date;
  resume_id?: number;
  /** Padrão: `-applied_at`. */
  sort?: ApplicationSort;
}

export type ApplicationData = Omit<Application, "id" | "created_at" | "updated_at">;

/** Alterações de uma edição comum: nunca incluem o status. */
export type ApplicationChanges = Partial<Omit<ApplicationData, "status">>;

export interface StatusChangeResult {
  application: Application;
  event: ApplicationEvent;
}

export interface ApplicationRepository {
  /** Cria a candidatura e o evento inicial, na mesma operação. */
  create(data: ApplicationData, event: NewApplicationEvent): Promise<Application>;
  findAll(filters: ApplicationFilters): Promise<Application[]>;
  findById(id: number): Promise<Application | null>;
  update(id: number, changes: ApplicationChanges): Promise<Application>;
  /** Muda o status e registra o evento, na mesma operação. */
  changeStatus(id: number, status: Status, event: NewApplicationEvent): Promise<StatusChangeResult>;
  /** Exclui a candidatura e todos os eventos dela. */
  delete(id: number): Promise<void>;
  /** Contagem por status; status sem candidaturas podem faltar. */
  countByStatus(): Promise<Partial<Record<Status, number>>>;
  /** Candidaturas com `applied_at` maior ou igual a `date`. */
  countAppliedSince(date: Date): Promise<number>;
}
