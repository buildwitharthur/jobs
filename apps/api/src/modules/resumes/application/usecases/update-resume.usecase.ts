import { AppError } from "../../../../common/domain/errors/app-error.js";
import type { ResumeWithUsage } from "../../domain/models/resume.model.js";
import type { ResumeRepository } from "../../domain/repositories/resume.repository.js";

export type UpdateResumeInput = {
  id: number;
  changes: { name?: string; description?: string | null };
};
export type UpdateResumeOutput = ResumeWithUsage;

export class UpdateResumeUseCase {
  constructor(private readonly resumeRepository: ResumeRepository) {}

  async execute({ id, changes }: UpdateResumeInput): Promise<UpdateResumeOutput> {
    const resume = await this.resumeRepository.findById(id);

    if (!resume) {
      throw new AppError("Currículo não encontrado.", 404, "not_found");
    }

    const next: { name?: string; description?: string | null } = { ...changes };

    if (changes.name !== undefined) {
      next.name = changes.name.trim();

      if (!next.name) {
        throw new AppError("O nome do currículo é obrigatório.", 400, "validation_error");
      }
    }

    return this.resumeRepository.update(id, next);
  }
}
