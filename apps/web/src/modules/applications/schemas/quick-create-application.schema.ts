import { z } from "zod";

/** Formulário rápido do "+" de uma coluna do kanban: só empresa e cargo. */
export const quickCreateApplicationSchema = z.object({
  company: z.string().trim().min(1, "Informe a empresa."),
  role: z.string().trim().min(1, "Informe o cargo."),
});

export type QuickCreateApplicationFormValues = z.infer<typeof quickCreateApplicationSchema>;
