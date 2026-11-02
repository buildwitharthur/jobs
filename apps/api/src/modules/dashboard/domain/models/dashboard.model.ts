import type { RecentEvent } from "../../../events/domain/models/event.model.js";
import type { Status } from "../../../statuses/domain/models/status.model.js";

export interface Dashboard {
  total: number;
  active: number;
  closed: number;
  by_status: Record<Status, number>;
  applied_last_30_days: number;
  recent_events: RecentEvent[];
}
