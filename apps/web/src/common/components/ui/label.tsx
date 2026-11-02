import type { ComponentProps } from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "../../utils/cn";

/** Rótulo de campo (design.md: `{typography.label}` em `text-secondary`). */
export function Label({ className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn("text-label text-text-secondary select-none", className)}
      {...props}
    />
  );
}
