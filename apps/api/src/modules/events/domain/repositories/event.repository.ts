import type { ApplicationEvent, NewApplicationEvent, RecentEvent } from "../models/event.model.js";

export interface EventRepository {
  /** Eventos da candidatura, do mais recente para o mais antigo (`occurred_at`). */
  findAllByApplication(applicationId: number): Promise<ApplicationEvent[]>;
  findById(id: number): Promise<ApplicationEvent | null>;
  /** Cria o evento e atualiza o `updated_at` da candidatura. */
  create(applicationId: number, data: NewApplicationEvent): Promise<ApplicationEvent>;
  update(
    id: number,
    changes: { note?: string | null; occurred_at?: Date },
  ): Promise<ApplicationEvent>;
  delete(id: number): Promise<void>;
  /** `occurred_at` do evento mais recente de cada candidatura informada. */
  findLastOccurredAtByApplication(applicationIds: number[]): Promise<Map<number, Date>>;
  /** Eventos mais recentes de todas as candidaturas. */
  findRecent(limit: number): Promise<RecentEvent[]>;
}
