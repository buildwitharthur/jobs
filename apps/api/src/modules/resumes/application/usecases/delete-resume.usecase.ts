import { AppError } from "../../../../common/domain/errors/app-error.js";
import type { ResumeFileRepository } from "../../domain/repositories/resume-file.repository.js";
import type { ResumeRepository } from "../../domain/repositories/resume.repository.js";

export type DeleteResumeInput = { id: number };
export type DeleteResumeOutput = void;

export class DeleteResumeUseCase {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly resumeFileRepository: ResumeFileRepository,
  ) {}

  async execute({ id }: DeleteResumeInput): Promise<DeleteResumeOutput> {
    const resume = await this.resumeRepository.findById(id);

    if (!resume) {
      throw new AppError("Currículo não encontrado.", 404, "not_found");
    }

    if (resume.applications_count > 0) {
      throw new AppError(
        `O currículo está em uso por ${resume.applications_count} candidatura(s).`,
        409,
        "conflict",
      );
    }

    await this.resumeRepository.delete(id);
    await this.resumeFileRepository.delete(resume.file_path);
  }
}
