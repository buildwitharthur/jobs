import type { WorkModel } from "../../../applications/domain/models/application.model.js";
import type { Status } from "../../../statuses/domain/models/status.model.js";

export interface BoardCard {
  id: number;
  company: string;
  role: string;
  applied_at: Date;
  work_model: WorkModel | null;
  resume_name: string | null;
  /** `occurred_at` do evento mais recente da candidatura. */
  last_event_at: Date;
}

export interface BoardColumn {
  status: Status;
  label: string;
  count: number;
  cards: BoardCard[];
}

export interface Board {
  columns: BoardColumn[];
}
