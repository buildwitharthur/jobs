import { AppError } from "../../../../common/domain/errors/app-error.js";
import type { ResumeFileRepository } from "../../domain/repositories/resume-file.repository.js";
import type { ResumeRepository } from "../../domain/repositories/resume.repository.js";

export type GetResumeFileInput = { id: number };
export type GetResumeFileOutput = {
  /** Caminho completo do PDF no disco. */
  file_path: string;
  /** Nome original do arquivo. */
  file_name: string;
};

export class GetResumeFileUseCase {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly resumeFileRepository: ResumeFileRepository,
  ) {}

  async execute({ id }: GetResumeFileInput): Promise<GetResumeFileOutput> {
    const resume = await this.resumeRepository.findById(id);

    if (!resume) {
      throw new AppError("Currículo não encontrado.", 404, "not_found");
    }

    if (!(await this.resumeFileRepository.exists(resume.file_path))) {
      throw new AppError("Arquivo do currículo não encontrado.", 404, "not_found");
    }

    return {
      file_path: this.resumeFileRepository.locate(resume.file_path),
      file_name: resume.file_name,
    };
  }
}
