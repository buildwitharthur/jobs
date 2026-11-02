import { AppError } from "../../../../common/domain/errors/app-error.js";
import type { ApplicationRepository } from "../../domain/repositories/application.repository.js";

export type DeleteApplicationInput = { id: number };
export type DeleteApplicationOutput = void;

export class DeleteApplicationUseCase {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  async execute({ id }: DeleteApplicationInput): Promise<DeleteApplicationOutput> {
    const application = await this.applicationRepository.findById(id);

    if (!application) {
      throw new AppError("Candidatura não encontrada.", 404, "not_found");
    }

    await this.applicationRepository.delete(id);
  }
}
