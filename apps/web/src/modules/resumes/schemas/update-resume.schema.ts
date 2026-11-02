import { z } from "zod";

/** Edição no lugar do nome e da descrição de um currículo. */
export const updateResumeSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do currículo."),
  description: z.string().trim(),
});

export type UpdateResumeFormValues = z.infer<typeof updateResumeSchema>;
