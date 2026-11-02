import type { ComponentProps } from "react";
import { XIcon } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { cn } from "../../utils/cn";

/**
 * Painel lateral (design.md: drawer), feito com o Dialog do Radix. Ex.: detalhe da candidatura.
 * Diferente do modal, não escurece o fundo: a tela atrás continua visível.
 */
export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;

export function SheetContent({
  className,
  children,
  ...props
}: ComponentProps<typeof SheetPrimitive.Content>) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Content
        className={cn(
          "w-drawer animate-sheet-in fixed inset-y-0 right-0 z-30 flex max-w-full flex-col",
          "border-border bg-surface text-text-primary shadow-overlay border-l",
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          aria-label="Fechar"
          className={cn(
            "top-lg right-xl size-control-sm absolute inline-flex cursor-pointer items-center",
            "text-text-secondary hover:bg-surface-sunken hover:text-text-primary justify-center rounded-sm",
          )}
        >
          <XIcon className="size-4" />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

export function SheetTitle({ className, ...props }: ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title className={cn("text-title", className)} {...props} />;
}

export function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      className={cn("text-body text-text-secondary", className)}
      {...props}
    />
  );
}
