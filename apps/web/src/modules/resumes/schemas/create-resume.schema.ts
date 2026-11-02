import { z } from "zod";

/** Formulário de novo currículo: nome, descrição e o PDF. */
export const createResumeSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do currículo."),
  description: z.string().trim(),
  file: z.custom<File>((value) => value instanceof File, "Selecione o arquivo PDF."),
});

export type CreateResumeFormValues = z.infer<typeof createResumeSchema>;
