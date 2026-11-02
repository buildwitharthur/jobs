import { z } from "zod";

/** Campos do formulário de candidatura. Os valores são sempre texto, como nos inputs. */
export const createApplicationSchema = z.object({
  company: z.string().trim().min(1, "Informe a empresa."),
  role: z.string().trim().min(1, "Informe o cargo."),
  job_url: z
    .string()
    .trim()
    .refine((value) => value === "" || URL.canParse(value), "Informe um link válido."),
  source: z.string().trim(),
  applied_at: z.string().min(1, "Informe a data."),
  status: z.string(),
  resume_id: z.string(),
  salary: z.string().trim(),
  work_model: z.enum(["", "remote", "hybrid", "onsite"]),
  location: z.string().trim(),
  contacts: z.string().trim(),
  notes: z.string().trim(),
});

export type CreateApplicationFormValues = z.infer<typeof createApplicationSchema>;
