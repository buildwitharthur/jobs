import { AppError } from "../../../../common/domain/errors/app-error.js";
import type { ResumeRepository } from "../../../resumes/domain/repositories/resume.repository.js";
import type { Application } from "../../domain/models/application.model.js";
import type {
  ApplicationChanges,
  ApplicationRepository,
} from "../../domain/repositories/application.repository.js";

export type UpdateApplicationInput = { id: number; changes: ApplicationChanges };
export type UpdateApplicationOutput = Application;

export class UpdateApplicationUseCase {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly resumeRepository: ResumeRepository,
  ) {}

  async execute({ id, changes }: UpdateApplicationInput): Promise<UpdateApplicationOutput> {
    const application = await this.applicationRepository.findById(id);

    if (!application) {
      throw new AppError("Candidatura não encontrada.", 404, "not_found");
    }

    const next: ApplicationChanges = { ...changes };

    if (changes.company !== undefined) {
      next.company = changes.company.trim();
    }

    if (changes.role !== undefined) {
      next.role = changes.role.trim();
    }

    if (next.company === "" || next.role === "") {
      throw new AppError("Empresa e cargo não podem ser vazios.", 400, "validation_error");
    }

    if (changes.resume_id != null && !(await this.resumeRepository.findById(changes.resume_id))) {
      throw new AppError("Currículo não encontrado.", 400, "validation_error");
    }

    return this.applicationRepository.update(id, next);
  }
}
