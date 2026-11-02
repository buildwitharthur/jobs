import type { StatusDefinition } from "../../domain/models/status.model.js";
import type { StatusRepository } from "../../domain/repositories/status.repository.js";

export type ListStatusesInput = void;
export type ListStatusesOutput = StatusDefinition[];

export class ListStatusesUseCase {
  constructor(private readonly statusRepository: StatusRepository) {}

  async execute(): Promise<StatusDefinition[]> {
    return this.statusRepository.findAll();
  }
}
