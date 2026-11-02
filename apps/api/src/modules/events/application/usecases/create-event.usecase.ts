import { AppError } from "../../../../common/domain/errors/app-error.js";
import type { ApplicationRepository } from "../../../applications/domain/repositories/application.repository.js";
import type { ApplicationEvent } from "../../domain/models/event.model.js";
import type { EventRepository } from "../../domain/repositories/event.repository.js";

export type CreateEventInput = {
  application_id: number;
  note: string;
  occurred_at?: Date;
};
export type CreateEventOutput = ApplicationEvent;

export class CreateEventUseCase {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly applicationRepository: ApplicationRepository,
  ) {}

  async execute({
    application_id,
    note,
    occurred_at,
  }: CreateEventInput): Promise<CreateEventOutput> {
    const application = await this.applicationRepository.findById(application_id);

    if (!application) {
      throw new AppError("Candidatura não encontrada.", 404, "not_found");
    }

    const trimmedNote = note.trim();

    if (!trimmedNote) {
      throw new AppError("A nota é obrigatória.", 400, "validation_error");
    }

    return this.eventRepository.create(application_id, {
      type: "note",
      from_status: null,
      to_status: null,
      note: trimmedNote,
      occurred_at: occurred_at ?? new Date(),
    });
  }
}
