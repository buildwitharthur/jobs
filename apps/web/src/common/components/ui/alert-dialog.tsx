import type { ComponentProps, ReactNode } from "react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { cn } from "../../utils/cn";
import { Button } from "./button";

/** Alerta que pede confirmação (design.md: alert-dialog). Ex.: excluir uma candidatura. */
export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export function AlertDialogContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPrimitive.Portal>
      {/* Acima do painel lateral e do modal, de onde o alerta costuma abrir. */}
      <AlertDialogPrimitive.Overlay className="animate-fade-in bg-backdrop fixed inset-0 z-60" />
      <AlertDialogPrimitive.Content
        className={cn(
          "fixed top-[10vh] left-1/2 z-70 flex w-[calc(100%-2rem)] max-w-105 -translate-x-1/2",
          "animate-modal-in gap-md flex-col",
          "bg-surface p-xl text-text-primary shadow-overlay rounded-lg",
          className,
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  );
}

export function AlertDialogTitle({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return <AlertDialogPrimitive.Title className={cn("text-title", className)} {...props} />;
}

export function AlertDialogDescription({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={cn("text-body text-text-secondary", className)}
      {...props}
    />
  );
}

/** Rodapé do alerta: ações alinhadas à direita (Cancelar, Excluir). */
export function AlertDialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("gap-xs flex items-center justify-end", className)} {...props} />;
}

type DeleteAlertProps = {
  /** O que abre o alerta (ex.: o botão "Excluir"). Renderizado como está (`asChild`). */
  children: ReactNode;
  title: string;
  description: ReactNode;
  /** Texto do botão que exclui. */
  confirmLabel?: string;
  /** Roda ao confirmar; o alerta fecha sozinho. */
  onConfirm: () => void;
};

/**
 * Confirmação de exclusão (ui.md, princípio 7): o filho abre um alerta com "Cancelar" e o botão
 * que exclui. O foco começa em "Cancelar", então um `Enter` sem querer não exclui nada.
 */
export function DeleteAlert({
  children,
  title,
  description,
  confirmLabel = "Excluir",
  onConfirm,
}: DeleteAlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <div className="gap-xs flex flex-col">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </div>
        <AlertDialogFooter>
          <AlertDialogPrimitive.Cancel asChild>
            <Button variant="secondary">Cancelar</Button>
          </AlertDialogPrimitive.Cancel>
          <AlertDialogPrimitive.Action asChild>
            <Button variant="danger-confirm" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </AlertDialogPrimitive.Action>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
