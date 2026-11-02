import type { ComponentProps } from "react";
import { Slot } from "radix-ui";
import { cn, tv, type VariantProps } from "../../utils/cn";

/** Botões do design system (design.md: button-primary, -secondary, -ghost, -danger). */
export const buttonVariants = tv({
  base: [
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-xs whitespace-nowrap",
    "rounded-md border border-transparent text-body font-medium transition-colors",
    "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-border disabled:text-text-muted",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  variants: {
    variant: {
      primary: "bg-primary text-on-primary hover:bg-primary-hover",
      secondary: "border-border bg-surface text-text-primary hover:bg-surface-sunken",
      ghost: "rounded-sm text-text-secondary hover:bg-surface-sunken hover:text-text-primary",
      danger: "text-danger-text hover:bg-danger-bg",
      // Botão que confirma uma ação destrutiva (ex.: "Excluir" do alerta, "Trocar arquivo").
      "danger-confirm": "bg-danger-solid text-on-danger",
    },
    size: {
      md: "h-control-md px-sm",
      sm: "h-control-sm px-xs",
      // Botão só com ícone: precisa de aria-label.
      icon: "size-control-sm p-0",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Renderiza o filho (ex.: um `<a>` ou `<Link>`) com o visual de botão. */
    asChild?: boolean;
  };

export function Button({ variant, size, asChild, className, type, ...props }: ButtonProps) {
  const Component = asChild ? Slot.Root : "button";

  return (
    <Component
      className={cn(buttonVariants({ variant, size }), className)}
      type={asChild ? undefined : (type ?? "button")}
      {...props}
    />
  );
}
