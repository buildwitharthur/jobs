import { AppError } from "../../../../common/domain/errors/app-error.js";
import type { ApplicationEvent } from "../../../events/domain/models/event.model.js";
import type { EventRepository } from "../../../events/domain/repositories/event.repository.js";
import type { ResumeRepository } from "../../../resumes/domain/repositories/resume.repository.js";
import type { Application } from "../../domain/models/application.model.js";
import type { ApplicationRepository } from "../../domain/repositories/application.repository.js";

export type GetApplicationInput = { id: number };
export type GetApplicationOutput = Omit<Application, "resume_id"> & {
  resume: { id: number; name: string } | null;
  /** Do mais recente para o mais antigo. */
  events: ApplicationEvent[];
};

export class GetApplicationUseCase {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly resumeRepository: ResumeRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async execute({ id }: GetApplicationInput): Promise<GetApplicationOutput> {
    const application = await this.applicationRepository.findById(id);

    if (!application) {
      throw new AppError("Candidatura não encontrada.", 404, "not_found");
    }

    const { resume_id: resumeId, ...fields } = application;
    const resume = resumeId === null ? null : await this.resumeRepository.findById(resumeId);
    const events = await this.eventRepository.findAllByApplication(id);

    return {
      ...fields,
      resume: resume ? { id: resume.id, name: resume.name } : null,
      events,
    };
  }
}
