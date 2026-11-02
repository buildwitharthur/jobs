import { AppError } from "../../../../common/domain/errors/app-error.js";
import type { ApplicationRepository } from "../../../applications/domain/repositories/application.repository.js";
import type { ApplicationEvent } from "../../domain/models/event.model.js";
import type { EventRepository } from "../../domain/repositories/event.repository.js";

export type UpdateEventInput = {
  application_id: number;
  event_id: number;
  note?: string | null;
  occurred_at?: Date;
};
export type UpdateEventOutput = ApplicationEvent;

export class UpdateEventUseCase {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly applicationRepository: ApplicationRepository,
  ) {}

  async execute({
    application_id,
    event_id,
    note,
    occurred_at,
  }: UpdateEventInput): Promise<UpdateEventOutput> {
    const application = await this.applicationRepository.findById(application_id);

    if (!application) {
      throw new AppError("Candidatura não encontrada.", 404, "not_found");
    }

    const event = await this.eventRepository.findById(event_id);

    if (!event || event.application_id !== application_id) {
      throw new AppError("Evento não encontrado.", 404, "not_found");
    }

    const changes: { note?: string | null; occurred_at?: Date } = {};

    if (note !== undefined) {
      const trimmedNote = note === null ? null : note.trim() || null;

      if (event.type === "note" && trimmedNote === null) {
        throw new AppError("A nota é obrigatória.", 400, "validation_error");
      }

      changes.note = trimmedNote;
    }

    if (occurred_at !== undefined) {
      changes.occurred_at = occurred_at;
    }

    return this.eventRepository.update(event_id, changes);
  }
}
