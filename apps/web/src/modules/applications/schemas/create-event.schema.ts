import { z } from "zod";

/** Campo "Adicionar nota" do histórico da candidatura. */
export const createEventSchema = z.object({
  note: z.string().trim().min(1, "Escreva a nota."),
  // Vazio = agora. Preenchido, é uma data retroativa (`<input type="datetime-local">`).
  occurred_at: z.string(),
});

export type CreateEventFormValues = z.infer<typeof createEventSchema>;
