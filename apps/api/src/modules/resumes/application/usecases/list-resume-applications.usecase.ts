import { AppError } from "../../../../common/domain/errors/app-error.js";
import type { Application } from "../../../applications/domain/models/application.model.js";
import type { ApplicationRepository } from "../../../applications/domain/repositories/application.repository.js";
import type { ResumeRepository } from "../../domain/repositories/resume.repository.js";

export type ListResumeApplicationsInput = { id: number };
export type ListResumeApplicationsOutput = Application[];

export class ListResumeApplicationsUseCase {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly applicationRepository: ApplicationRepository,
  ) {}

  async execute({ id }: ListResumeApplicationsInput): Promise<ListResumeApplicationsOutput> {
    const resume = await this.resumeRepository.findById(id);

    if (!resume) {
      throw new AppError("Currículo não encontrado.", 404, "not_found");
    }

    return this.applicationRepository.findAll({ resume_id: id });
  }
}
