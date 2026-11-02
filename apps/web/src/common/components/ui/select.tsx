import type { ComponentProps } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import { cn } from "../../utils/cn";

/**
 * Seleção de uma opção (status, currículo, modelo de trabalho). O texto do `placeholder` do
 * `SelectValue` aparece quando não há valor escolhido. Atenção: o Radix não aceita `value=""` num
 * `SelectItem`; para "nenhum", use um valor próprio (ex.: "none").
 */
export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "h-control-md gap-xs inline-flex w-full cursor-pointer items-center justify-between",
        "border-border-input bg-surface px-sm text-body text-text-primary rounded-md border",
        "focus:border-primary focus:ring-focus focus:ring-2 focus:outline-none",
        "data-placeholder:text-text-muted aria-invalid:border-danger-solid",
        "disabled:cursor-not-allowed disabled:opacity-60 [&>span]:truncate",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="text-text-secondary size-4 shrink-0" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        sideOffset={4}
        className={cn(
          "z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width)",
          "animate-fade-in border-border bg-surface overflow-hidden rounded-md border",
          "text-text-primary shadow-overlay",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-xxs">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "h-control-md gap-xs pr-xxl pl-xs relative flex cursor-pointer items-center rounded-sm",
        "text-body data-highlighted:bg-surface-sunken outline-none select-none",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="right-xs absolute inline-flex items-center">
        <CheckIcon className="text-primary-text size-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
