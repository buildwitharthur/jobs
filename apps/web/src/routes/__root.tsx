import type { QueryClient } from "@tanstack/react-query";
import { Navigate, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

/** Contexto do router: disponível em todos os `loader` (ex.: `context.queryClient`). */
export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  // Endereço que não existe: volta para a tela inicial, como no protótipo.
  notFoundComponent: () => <Navigate to="/candidaturas" replace />,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </>
  );
}
