import { AppError } from "../../../../common/domain/errors/app-error.js";
import type { ApplicationRepository } from "../../../applications/domain/repositories/application.repository.js";
import type { EventRepository } from "../../domain/repositories/event.repository.js";

export type DeleteEventInput = { application_id: number; event_id: number };
export type DeleteEventOutput = void;

export class DeleteEventUseCase {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly applicationRepository: ApplicationRepository,
  ) {}

  async execute({ application_id, event_id }: DeleteEventInput): Promise<DeleteEventOutput> {
    const application = await this.applicationRepository.findById(application_id);

    if (!application) {
      throw new AppError("Candidatura não encontrada.", 404, "not_found");
    }

    const event = await this.eventRepository.findById(event_id);

    if (!event || event.application_id !== application_id) {
      throw new AppError("Evento não encontrado.", 404, "not_found");
    }

    if (event.type === "created") {
      throw new AppError("O evento de criação não pode ser excluído.", 400, "validation_error");
    }

    await this.eventRepository.delete(event_id);
  }
}
