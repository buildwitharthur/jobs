import { AppError } from "../../../../common/domain/errors/app-error.js";
import { isPdf } from "../../domain/models/resume.model.js";
import type { ResumeWithUsage } from "../../domain/models/resume.model.js";
import type { ResumeFileRepository } from "../../domain/repositories/resume-file.repository.js";
import type { ResumeRepository } from "../../domain/repositories/resume.repository.js";

export type ReplaceResumeFileInput = {
  id: number;
  file: { content: Buffer; original_name: string };
};
export type ReplaceResumeFileOutput = ResumeWithUsage;

export class ReplaceResumeFileUseCase {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly resumeFileRepository: ResumeFileRepository,
  ) {}

  async execute({ id, file }: ReplaceResumeFileInput): Promise<ReplaceResumeFileOutput> {
    const resume = await this.resumeRepository.findById(id);

    if (!resume) {
      throw new AppError("Currículo não encontrado.", 404, "not_found");
    }

    if (!isPdf(file.content)) {
      throw new AppError("O arquivo precisa ser um PDF.", 400, "validation_error");
    }

    const storedName = await this.resumeFileRepository.save(file.content);

    try {
      const updated = await this.resumeRepository.update(id, {
        file_name: file.original_name,
        file_path: storedName,
      });

      await this.resumeFileRepository.delete(resume.file_path);

      return updated;
    } catch (error) {
      await this.resumeFileRepository.delete(storedName);
      throw error;
    }
  }
}
