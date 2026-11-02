import type { ComponentProps } from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { cn } from "../../utils/cn";

/**
 * Grupo de opções que liga e desliga (design.md: alternador Kanban/Lista e chips de filtro).
 * `type="single"` para uma opção de cada vez (Kanban/Lista); `type="multiple"` para os chips de status.
 */
export function ToggleGroup({
  className,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      className={cn(
        "border-border bg-surface inline-flex w-fit items-center gap-0.5 rounded-md border p-0.5",
        className,
      )}
      {...props}
    />
  );
}

export function ToggleGroupItem({
  className,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        "h-control-sm gap-xxs px-sm inline-flex cursor-pointer items-center rounded-sm",
        "text-body text-text-secondary hover:text-text-primary font-medium",
        "data-[state=on]:bg-primary-subtle data-[state=on]:text-primary-subtle-text",
        "[&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}
