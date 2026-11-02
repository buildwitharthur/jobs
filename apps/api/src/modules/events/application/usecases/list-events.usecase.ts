import { AppError } from "../../../../common/domain/errors/app-error.js";
import type { ApplicationRepository } from "../../../applications/domain/repositories/application.repository.js";
import type { ApplicationEvent } from "../../domain/models/event.model.js";
import type { EventRepository } from "../../domain/repositories/event.repository.js";

export type ListEventsInput = { application_id: number };
export type ListEventsOutput = ApplicationEvent[];

export class ListEventsUseCase {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly applicationRepository: ApplicationRepository,
  ) {}

  async execute({ application_id }: ListEventsInput): Promise<ListEventsOutput> {
    const application = await this.applicationRepository.findById(application_id);

    if (!application) {
      throw new AppError("Candidatura não encontrada.", 404, "not_found");
    }

    return this.eventRepository.findAllByApplication(application_id);
  }
}
