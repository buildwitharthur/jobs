import { daysAgoUtc } from "../../../../common/domain/date.js";
import type { ApplicationRepository } from "../../../applications/domain/repositories/application.repository.js";
import type { EventRepository } from "../../../events/domain/repositories/event.repository.js";
import type { Status } from "../../../statuses/domain/models/status.model.js";
import type { StatusRepository } from "../../../statuses/domain/repositories/status.repository.js";
import type { Dashboard } from "../../domain/models/dashboard.model.js";

const RECENT_EVENTS_LIMIT = 10;
const RECENT_APPLICATIONS_DAYS = 30;

export type GetDashboardInput = void;
export type GetDashboardOutput = Dashboard;

export class GetDashboardUseCase {
  constructor(
    private readonly statusRepository: StatusRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(): Promise<GetDashboardOutput> {
    const [statuses, counts, appliedLast30Days, recentEvents] = await Promise.all([
      this.statusRepository.findAll(),
      this.applicationRepository.countByStatus(),
      this.applicationRepository.countAppliedSince(daysAgoUtc(RECENT_APPLICATIONS_DAYS)),
      this.eventRepository.findRecent(RECENT_EVENTS_LIMIT),
    ]);

    const byStatus = {} as Record<Status, number>;
    let active = 0;
    let closed = 0;

    for (const status of statuses) {
      const count = counts[status.value] ?? 0;
      byStatus[status.value] = count;

      if (status.type === "active") {
        active += count;
      } else {
        closed += count;
      }
    }

    return {
      total: active + closed,
      active,
      closed,
      by_status: byStatus,
      applied_last_30_days: appliedLast30Days,
      recent_events: recentEvents,
    };
  }
}
