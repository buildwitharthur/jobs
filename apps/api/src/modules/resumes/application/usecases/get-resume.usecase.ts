import { AppError } from "../../../../common/domain/errors/app-error.js";
import type { ResumeWithUsage } from "../../domain/models/resume.model.js";
import type { ResumeRepository } from "../../domain/repositories/resume.repository.js";

export type GetResumeInput = { id: number };
export type GetResumeOutput = ResumeWithUsage;

export class GetResumeUseCase {
  constructor(private readonly resumeRepository: ResumeRepository) {}

  async execute({ id }: GetResumeInput): Promise<GetResumeOutput> {
    const resume = await this.resumeRepository.findById(id);

    if (!resume) {
      throw new AppError("Currículo não encontrado.", 404, "not_found");
    }

    return resume;
  }
}
