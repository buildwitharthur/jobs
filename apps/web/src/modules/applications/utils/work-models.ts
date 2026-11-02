import { Building2, House, Shuffle } from "lucide-react";

/** Modelos de trabalho, com o rótulo e o ícone usados no modal e no card do kanban. */
export const WORK_MODELS = [
  { value: "remote", label: "Remoto", icon: House },
  { value: "hybrid", label: "Híbrido", icon: Shuffle },
  { value: "onsite", label: "Presencial", icon: Building2 },
] as const;

export type WorkModel = (typeof WORK_MODELS)[number]["value"];

export const findWorkModel = (value: WorkModel | null) =>
  WORK_MODELS.find((model) => model.value === value);
