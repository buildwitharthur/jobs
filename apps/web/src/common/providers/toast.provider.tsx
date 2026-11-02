import type { CSSProperties, ReactNode } from "react";
import { Toaster } from "sonner";
import { cn } from "../utils/cn";

/**
 * Avisos (toasts) com o Sonner, no visual do design system (specs/design/design.md, componente
 * `toast`): canto inferior direito, fundo `surface`, borda fina, sombra de sobreposição e ícone
 * colorido por tipo. `unstyled` desliga os estilos padrão do Sonner; só valem as classes abaixo,
 * que usam os tokens e por isso acompanham o tema escuro e o claro.
 *
 * Uso em qualquer lugar do app: `import { toast } from "sonner"` e `toast.success("Salvo")`.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        visibleToasts={3}
        gap={8}
        // Avisos sempre em lista, um embaixo do outro (sem o efeito de pilha sobreposta do Sonner,
        // que no modo `unstyled` deixa o texto dos de trás aparecer).
        expand
        offset={24}
        // Largura do aviso (padrão do Sonner: 356px), para caber o texto e os botões de ação.
        style={{ "--width": "420px" } as CSSProperties}
        toastOptions={{
          unstyled: true,
          // 5 segundos, como no protótipo.
          duration: 5000,
          classNames: {
            toast: cn(
              "flex w-full items-center gap-sm rounded-md border border-border bg-surface",
              "px-md py-sm text-body text-text-primary shadow-overlay",
            ),
            content: "flex min-w-0 flex-1 flex-col",
            title: "text-body",
            description: "text-caption text-text-secondary",
            icon: "flex size-6 shrink-0 items-center justify-center rounded-full [&>svg]:size-4",
            success: "[&_[data-icon]]:bg-success-bg [&_[data-icon]]:text-success-text",
            error: "[&_[data-icon]]:bg-danger-bg [&_[data-icon]]:text-danger-text",
            warning: "[&_[data-icon]]:bg-warning-bg [&_[data-icon]]:text-warning-text",
            info: "[&_[data-icon]]:bg-info-bg [&_[data-icon]]:text-info-text",
            actionButton: cn(
              "inline-flex h-control-sm shrink-0 items-center whitespace-nowrap rounded-sm px-xs text-body font-medium",
              "text-text-secondary hover:bg-surface-sunken hover:text-text-primary",
            ),
            cancelButton: cn(
              "inline-flex h-control-sm shrink-0 items-center whitespace-nowrap rounded-sm px-xs text-body font-medium",
              "text-text-secondary hover:bg-surface-sunken hover:text-text-primary",
            ),
          },
        }}
      />
    </>
  );
}
