import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

type StatusProps = {
  /** `value` do status vindo da API (`applied`, `interview`...). */
  status: string;
};

/**
 * Selo de status (design.md: status-badge). A cor vem do `data-status`; não existe badge no Radix.
 */
export function StatusBadge({ status, className, ...props }: ComponentProps<"span"> & StatusProps) {
  return (
    <span
      data-status={status}
      className={cn(
        "bg-status-bg px-xs text-label inline-flex items-center gap-1.5 rounded-sm py-0.5",
        "text-status-text whitespace-nowrap",
        className,
      )}
      {...props}
    />
  );
}

/** Ponto colorido do status (design.md: status-dot), sempre ao lado do nome do status. */
export function StatusDot({ status, className, ...props }: ComponentProps<"span"> & StatusProps) {
  return (
    <span
      aria-hidden
      data-status={status}
      className={cn("bg-status-accent inline-block size-2 shrink-0 rounded-full", className)}
      {...props}
    />
  );
}
