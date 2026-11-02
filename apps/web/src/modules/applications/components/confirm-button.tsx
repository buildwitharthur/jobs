import { useEffect, useState, type ComponentProps } from "react";
import { Button } from "../../../common/components/ui/button";

type ConfirmButtonProps = Omit<ComponentProps<typeof Button>, "onClick" | "variant"> & {
  /** Roda no segundo clique. */
  onConfirm: () => void;
  /** Texto do segundo estado. */
  confirmLabel?: string;
};

/**
 * Exclusão com confirmação em dois cliques (ui.md, princípio 7; design.md: button-danger e
 * button-danger-confirm): o primeiro clique arma, o segundo executa. Desarma sozinho em 4 segundos
 * ou ao perder o foco (clicar fora).
 */
export function ConfirmButton({
  onConfirm,
  confirmLabel = "Confirmar exclusão?",
  size,
  children,
  ...props
}: ConfirmButtonProps) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timeout = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(timeout);
  }, [armed]);

  return (
    <Button
      variant={armed ? "danger-confirm" : "danger"}
      // Botão só com ícone vira um botão com texto ao armar.
      size={armed && size === "icon" ? "sm" : size}
      onBlur={() => setArmed(false)}
      onClick={() => {
        if (!armed) return setArmed(true);
        setArmed(false);
        onConfirm();
      }}
      {...props}
      // Armado, o rótulo acessível também pede a confirmação.
      aria-label={armed ? confirmLabel : props["aria-label"]}
    >
      {armed ? confirmLabel : children}
    </Button>
  );
}
