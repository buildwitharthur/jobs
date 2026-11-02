import { z } from "zod";
import {
  EventType,
  Status,
} from "../../../../../common/infrastructure/database/prisma/generated/enums.js";
import type { ApplicationEvent } from "../../../domain/models/event.model.js";

export const eventResponseSchema = z.object({
  id: z.number().int(),
  application_id: z.number().int(),
  type: z.enum(EventType),
  from_status: z.enum(Status).nullable(),
  to_status: z.enum(Status).nullable(),
  note: z.string().nullable(),
  occurred_at: z.string(),
  created_at: z.string(),
});

export const toEventResponse = (event: ApplicationEvent) => ({
  id: event.id,
  application_id: event.application_id,
  type: event.type,
  from_status: event.from_status,
  to_status: event.to_status,
  note: event.note,
  occurred_at: event.occurred_at.toISOString(),
  created_at: event.created_at.toISOString(),
});
