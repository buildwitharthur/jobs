import { Outlet } from "@tanstack/react-router";

/** Layout das páginas do app (menu lateral, cabeçalho...). Por enquanto só renderiza a página. */
export function ShellLayout() {
  return <Outlet />;
}
