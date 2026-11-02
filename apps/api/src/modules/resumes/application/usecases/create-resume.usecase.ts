import { AppError } from "../../../../common/domain/errors/app-error.js";
import { isPdf } from "../../domain/models/resume.model.js";
import type { ResumeWithUsage } from "../../domain/models/resume.model.js";
import type { ResumeFileRepository } from "../../domain/repositories/resume-file.repository.js";
import type { ResumeRepository } from "../../domain/repositories/resume.repository.js";

export type CreateResumeInput = {
  name: string;
  description?: string | null;
  file: { content: Buffer; original_name: string };
};
export type CreateResumeOutput = ResumeWithUsage;

export class CreateResumeUseCase {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly resumeFileRepository: ResumeFileRepository,
  ) {}

  async execute({ name, description, file }: CreateResumeInput): Promise<CreateResumeOutput> {
    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new AppError("O nome do currículo é obrigatório.", 400, "validation_error");
    }

    if (!isPdf(file.content)) {
      throw new AppError("O arquivo precisa ser um PDF.", 400, "validation_error");
    }

    const storedName = await this.resumeFileRepository.save(file.content);

    try {
      return await this.resumeRepository.create({
        name: trimmedName,
        description: description ?? null,
        file_name: file.original_name,
        file_path: storedName,
      });
    } catch (error) {
      await this.resumeFileRepository.delete(storedName);
      throw error;
    }
  }
}
