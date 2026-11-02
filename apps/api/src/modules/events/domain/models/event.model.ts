import type { Status } from "../../../statuses/domain/models/status.model.js";

export type EventType = "created" | "status_change" | "note";

export interface ApplicationEvent {
  id: number;
  application_id: number;
  type: EventType;
  from_status: Status | null;
  to_status: Status | null;
  note: string | null;
  occurred_at: Date;
  created_at: Date;
}

/** Dados de um evento ainda não persistido. */
export type NewApplicationEvent = Omit<ApplicationEvent, "id" | "application_id" | "created_at">;

/** Evento recente de qualquer candidatura, com a empresa e o cargo dela. */
export interface RecentEvent {
  id: number;
  application_id: number;
  company: string;
  role: string;
  type: EventType;
  to_status: Status | null;
  occurred_at: Date;
}
