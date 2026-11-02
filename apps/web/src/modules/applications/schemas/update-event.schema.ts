import { z } from "zod";
import type { GetApplicationResponse } from "../http/get-application.http";

type EventType = GetApplicationResponse["events"][number]["type"];

/** Edição de um evento do histórico. Só a nota de um evento do tipo "note" é obrigatória. */
export const createUpdateEventSchema = (eventType: EventType) =>
  z.object({
    note: eventType === "note" ? z.string().trim().min(1, "Escreva a nota.") : z.string().trim(),
    occurred_at: z.string().min(1, "Informe a data."),
  });

export type UpdateEventFormValues = z.infer<ReturnType<typeof createUpdateEventSchema>>;
