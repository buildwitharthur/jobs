import type { Application } from "../../domain/models/application.model.js";
import type {
  ApplicationFilters,
  ApplicationRepository,
} from "../../domain/repositories/application.repository.js";

export type ListApplicationsInput = ApplicationFilters;
export type ListApplicationsOutput = Application[];

export class ListApplicationsUseCase {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  async execute(input: ListApplicationsInput): Promise<ListApplicationsOutput> {
    return this.applicationRepository.findAll(input);
  }
}
