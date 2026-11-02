import { useQueryClient } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { QueryProvider } from "./common/providers/query.provider";
import { ToastProvider } from "./common/providers/toast.provider";
import { routeTree } from "./routeTree.gen";
import "./styles.css";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  // O queryClient é criado pelo QueryProvider (dentro do React) e entra aqui pelo
  // <RouterProvider context={...}> abaixo; este valor é só um espaço reservado.
  context: { queryClient: undefined! },
});

// Registra o router para ter tipos nas rotas, links e parâmetros.
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const queryClient = useQueryClient();

  // Injeta o queryClient no contexto do router para os loaders usarem o mesmo cache das telas.
  return <RouterProvider router={router} context={{ queryClient }} />;
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <QueryProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </QueryProvider>
    </StrictMode>,
  );
}
