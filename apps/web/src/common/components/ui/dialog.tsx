import type { ComponentProps } from "react";
import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "../../utils/cn";

/** Modal (design.md: modal). Ex.: "Nova candidatura". */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="animate-fade-in bg-backdrop fixed inset-0 z-40" />
      <DialogPrimitive.Content
        className={cn(
          "max-w-modal fixed top-[10vh] left-1/2 z-50 flex max-h-[80vh] w-[calc(100%-2rem)]",
          "animate-modal-in gap-md -translate-x-1/2 flex-col overflow-y-auto",
          "bg-surface p-xl text-text-primary shadow-overlay rounded-lg",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label="Fechar"
          className={cn(
            "top-md right-md size-control-sm absolute inline-flex cursor-pointer items-center",
            "text-text-secondary hover:bg-surface-sunken hover:text-text-primary justify-center rounded-sm",
          )}
        >
          <XIcon className="size-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("text-title", className)} {...props} />;
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-body text-text-secondary", className)}
      {...props}
    />
  );
}

/** Rodapé do modal: ações alinhadas à direita (Cancelar, Salvar). */
export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("gap-xs flex items-center justify-end", className)} {...props} />;
}
