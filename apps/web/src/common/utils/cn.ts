import { extendTailwindMerge, type ClassNameValue, type ConfigExtension } from "tailwind-merge";
import { createTV } from "tailwind-variants";

export type { VariantProps } from "tailwind-variants";

/**
 * O tailwind-merge precisa conhecer as classes do design system (src/styles.css) para saber quais
 * conflitam. Sem isso, `text-display` (tamanho) e `text-text-primary` (cor) seriam tratados como o
 * mesmo grupo e um apagaria o outro. Mantenha em sincronia com os tokens de styles.css.
 */
const STATUS_VALUES = [
  "applied",
  "screening",
  "interview",
  "technical_test",
  "offer",
  "accepted",
  "rejected",
  "withdrawn",
  "no_response",
];

const twMergeConfig = {
  extend: {
    theme: {
      color: [
        "bg",
        "surface",
        "surface-sunken",
        "border",
        "border-input",
        "text-primary",
        "text-secondary",
        "text-muted",
        "primary",
        "primary-hover",
        "primary-text",
        "primary-subtle",
        "primary-subtle-text",
        "on-primary",
        "focus",
        "success-bg",
        "success-text",
        "danger-bg",
        "danger-text",
        "danger-solid",
        "on-danger",
        "warning-bg",
        "warning-text",
        "info-bg",
        "info-text",
        "backdrop",
        "drop-overlay",
        // Cor do status do ancestral com data-status="<value>".
        "status-bg",
        "status-text",
        "status-accent",
        ...STATUS_VALUES.flatMap((status) => [
          `status-${status}-bg`,
          `status-${status}-text`,
          `status-${status}-accent`,
        ]),
      ],
      text: ["display", "title", "heading", "body", "caption", "label", "number"],
      "font-weight": ["regular"],
      shadow: ["raised", "dragging", "overlay"],
      animate: ["fade-in", "modal-in", "sheet-in"],
      spacing: [
        "xxs",
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "xxl",
        "xxxl",
        "control-sm",
        "control-md",
        "nav",
        "drawer",
        "modal",
        "column-min",
        "column-max",
        "column-collapsed",
      ],
    },
  },
} satisfies ConfigExtension<string, string>;

const twMerge = extendTailwindMerge(twMergeConfig);

/** Junta classes do Tailwind resolvendo conflitos: a última vence (`cn("p-md", "p-xl")` → `p-xl`). */
export const cn = (...classes: ClassNameValue[]) => twMerge(classes);

/** `tv()` com o tailwind-merge configurado acima: define variantes de componente. */
export const tv = createTV({ twMerge: true, twMergeConfig });
