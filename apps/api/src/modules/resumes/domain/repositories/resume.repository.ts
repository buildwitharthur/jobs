import type { Resume, ResumeWithUsage } from "../models/resume.model.js";

export type ResumeData = Pick<Resume, "name" | "description" | "file_name" | "file_path">;

export interface ResumeRepository {
  /** Do mais recente para o mais antigo (`updated_at`). */
  findAll(): Promise<ResumeWithUsage[]>;
  findById(id: number): Promise<ResumeWithUsage | null>;
  create(data: ResumeData): Promise<ResumeWithUsage>;
  update(id: number, changes: Partial<ResumeData>): Promise<ResumeWithUsage>;
  delete(id: number): Promise<void>;
}
