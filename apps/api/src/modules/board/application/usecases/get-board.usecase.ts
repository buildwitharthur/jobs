import type { ApplicationRepository } from "../../../applications/domain/repositories/application.repository.js";
import type { EventRepository } from "../../../events/domain/repositories/event.repository.js";
import type { ResumeRepository } from "../../../resumes/domain/repositories/resume.repository.js";
import type { StatusRepository } from "../../../statuses/domain/repositories/status.repository.js";
import type { Board, BoardCard } from "../../domain/models/board.model.js";

export type GetBoardInput = { q?: string; from?: Date; to?: Date; resume_id?: number };
export type GetBoardOutput = Board;

export class GetBoardUseCase {
  constructor(
    private readonly statusRepository: StatusRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly resumeRepository: ResumeRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(input: GetBoardInput): Promise<GetBoardOutput> {
    const [statuses, applications, resumes] = await Promise.all([
      this.statusRepository.findAll(),
      this.applicationRepository.findAll(input),
      this.resumeRepository.findAll(),
    ]);

    const resumeNames = new Map(resumes.map((resume) => [resume.id, resume.name]));
    const lastEventAt = await this.eventRepository.findLastOccurredAtByApplication(
      applications.map((application) => application.id),
    );

    const columns = statuses.map((status) => {
      const cards: BoardCard[] = applications
        .filter((application) => application.status === status.value)
        .map((application) => ({
          id: application.id,
          company: application.company,
          role: application.role,
          applied_at: application.applied_at,
          work_model: application.work_model,
          resume_name:
            application.resume_id === null
              ? null
              : (resumeNames.get(application.resume_id) ?? null),
          last_event_at: lastEventAt.get(application.id) ?? application.created_at,
        }))
        .sort((a, b) => b.last_event_at.getTime() - a.last_event_at.getTime());

      return { status: status.value, label: status.label, count: cards.length, cards };
    });

    return { columns };
  }
}
