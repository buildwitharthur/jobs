import type { ComponentProps } from "react";
import { cn, type VariantProps } from "../../utils/cn";
import { inputVariants } from "./input";

type TextareaProps = ComponentProps<"textarea"> & VariantProps<typeof inputVariants>;

/** Texto longo, com as mesmas variantes do Input (`field` e `inline`). */
export function Textarea({ variant = "field", className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        inputVariants({ variant }),
        // Ajustes de altura para texto em várias linhas.
        "py-xs h-auto min-h-18 resize-y",
        className,
      )}
      {...props}
    />
  );
}
