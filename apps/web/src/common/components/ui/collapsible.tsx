import { Collapsible as CollapsiblePrimitive } from "radix-ui";

/**
 * Área que abre e fecha (ex.: "Mais detalhes" do modal, "Usado em N candidaturas" do currículo).
 * Sem estilo próprio: o visual é do conteúdo.
 */
export const Collapsible = CollapsiblePrimitive.Root;
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;
export const CollapsibleContent = CollapsiblePrimitive.Content;
