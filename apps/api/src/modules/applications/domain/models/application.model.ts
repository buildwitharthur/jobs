import type { Status } from "../../../statuses/domain/models/status.model.js";

export type WorkModel = "remote" | "hybrid" | "onsite";

export interface Application {
  id: number;
  company: string;
  role: string;
  job_url: string | null;
  source: string | null;
  applied_at: Date;
  status: Status;
  resume_id: number | null;
  salary: string | null;
  work_model: WorkModel | null;
  location: string | null;
  contacts: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}
