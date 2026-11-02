import { AppError } from "../../../../common/domain/errors/app-error.js";
import type { ApplicationEvent } from "../../../events/domain/models/event.model.js";
import type { Status } from "../../../statuses/domain/models/status.model.js";
import type { Application } from "../../domain/models/application.model.js";
import type { ApplicationRepository } from "../../domain/repositories/application.repository.js";

export type ChangeApplicationStatusInput = {
  id: number;
  status: Status;
  note?: string | null;
  occurred_at?: Date;
};
export type ChangeApplicationStatusOutput = {
  application: Application;
  /** `null` quando o status enviado já era o status atual. */
  event: ApplicationEvent | null;
};

export class ChangeApplicationStatusUseCase {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  async execute({
    id,
    status,
    note,
    occurred_at,
  }: ChangeApplicationStatusInput): Promise<ChangeApplicationStatusOutput> {
    const application = await this.applicationRepository.findById(id);

    if (!application) {
      throw new AppError("Candidatura não encontrada.", 404, "not_found");
    }

    if (application.status === status) {
      return { application, event: null };
    }

    return this.applicationRepository.changeStatus(id, status, {
      type: "status_change",
      from_status: application.status,
      to_status: status,
      note: note ?? null,
      occurred_at: occurred_at ?? new Date(),
    });
  }
}
