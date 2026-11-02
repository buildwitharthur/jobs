import { createFileRoute } from "@tanstack/react-router";
import { ShellLayout } from "../common/components/layouts/shell.layout";

// Rota de layout sem caminho: não aparece na URL. Todas as páginas de `routes/_shell/` ficam dentro dela.
export const Route = createFileRoute("/_shell")({
  component: ShellLayout,
});
