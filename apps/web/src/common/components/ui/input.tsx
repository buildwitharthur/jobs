import type { ComponentProps } from "react";
import { cn, tv, type VariantProps } from "../../utils/cn";

/**
 * Campos de texto (design.md: text-input e inline-field). Não existe input no Radix: é o elemento
 * nativo com o visual do design system. Com `aria-invalid`, ganha a borda de erro.
 */
export const inputVariants = tv({
  base: [
    "w-full min-w-0 text-body text-text-primary transition-colors placeholder:text-text-muted",
    "disabled:cursor-not-allowed disabled:opacity-60",
  ],
  variants: {
    variant: {
      // Campo de formulário (modal, filtros).
      field: [
        "h-control-md rounded-md border border-border-input bg-surface px-sm",
        "focus:border-primary focus:ring-2 focus:ring-focus focus:outline-none",
        "aria-invalid:border-danger-solid",
      ],
      // Campo editado no lugar (painel de detalhe): parece texto até receber foco.
      inline: [
        "min-h-control-sm rounded-sm border border-transparent bg-transparent px-xs py-xxs",
        "hover:bg-surface-sunken",
        "focus:border-border-input focus:bg-surface focus:ring-2 focus:ring-focus focus:outline-none",
        "aria-invalid:border-danger-solid",
      ],
    },
  },
  defaultVariants: { variant: "field" },
});

type InputProps = ComponentProps<"input"> & VariantProps<typeof inputVariants>;

export function Input({ variant, className, ...props }: InputProps) {
  return <input className={cn(inputVariants({ variant }), className)} {...props} />;
}
