import { z } from "zod";
import { createApplicationSchema } from "./create-application.schema";

/** Campos editáveis depois de criada: os mesmos da criação, menos o status (que muda por outra chamada). */
export const updateApplicationSchema = createApplicationSchema.omit({ status: true });

export type UpdateApplicationFormValues = z.infer<typeof updateApplicationSchema>;
export type UpdateApplicationField = keyof UpdateApplicationFormValues;
