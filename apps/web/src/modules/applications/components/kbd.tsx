import type { ComponentProps } from "react";
import { cn } from "../../../common/utils/cn";

/** Tecla de atalho (ex.: o "N" do botão "Nova candidatura", o "Enter" do rodapé do modal). */
export function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "border-border bg-surface text-caption text-text-secondary inline-flex h-[18px] min-w-[18px]",
        "items-center justify-center rounded-xs border px-1 font-sans",
        className,
      )}
      {...props}
    />
  );
}
