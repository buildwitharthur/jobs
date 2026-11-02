import type { ComponentProps, ReactNode } from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cn } from "../../utils/cn";

type TooltipProps = {
  /** Texto da dica. */
  content: ReactNode;
  /** Elemento que mostra a dica ao passar o mouse ou receber foco. */
  children: ReactNode;
} & Pick<ComponentProps<typeof TooltipPrimitive.Content>, "side" | "align">;

/**
 * Dica (design.md: tooltip). Usada em botões só com ícone e para explicar um botão desabilitado
 * (ex.: "Em uso por 4 candidaturas"). O filho precisa aceitar ref e foco; um botão desabilitado
 * deve ficar dentro de um `<span>` para a dica funcionar.
 */
export function Tooltip({ content, children, side = "top", align = "center" }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={6}
            className={cn(
              "animate-fade-in bg-text-primary px-xs py-xxs text-caption text-surface z-50 rounded-sm",
            )}
          >
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
