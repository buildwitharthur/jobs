import type { ResumeWithUsage } from "../../domain/models/resume.model.js";
import type { ResumeRepository } from "../../domain/repositories/resume.repository.js";

export type ListResumesInput = void;
export type ListResumesOutput = ResumeWithUsage[];

export class ListResumesUseCase {
  constructor(private readonly resumeRepository: ResumeRepository) {}

  async execute(): Promise<ListResumesOutput> {
    return this.resumeRepository.findAll();
  }
}
