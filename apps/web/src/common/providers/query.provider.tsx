import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

/**
 * Cache do TanStack Query, ajustado para este app: uma pessoa só, poucos dados, e quem muda os
 * dados é o próprio app. Sem isso o padrão do Query buscaria tudo de novo a cada montagem de
 * componente e a cada vez que a janela ganha foco.
 */
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Dado buscado vale por 1 minuto: navegar entre telas e reabrir o painel de detalhe usa o
        // cache e não chama a API. (Padrão: 0, ou seja, sempre busca de novo ao montar.)
        staleTime: 60 * 1000,
        // Dado que nenhuma tela usa mais fica 10 minutos em memória, para voltar a uma tela já
        // vista ser instantâneo. (Padrão: 5 minutos.)
        gcTime: 10 * 60 * 1000,
        // Os dados só mudam por ações feitas neste app (que invalidam o cache); não há motivo para
        // buscar de novo toda vez que a janela volta a ficar em foco. (Padrão: true.)
        refetchOnWindowFocus: false,
        // Uma nova tentativa basta: se a API caiu, esperar 3 tentativas só demora para mostrar o
        // erro. (Padrão: 3.)
        retry: 1,
      },
      mutations: {
        // Criar, editar e excluir não devem se repetir sozinhos.
        retry: 0,
      },
    },
  });

export function QueryProvider({ children }: { children: ReactNode }) {
  // O cliente é criado uma única vez por montagem do provider (e não a cada render).
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Só em desenvolvimento; no canto esquerdo para não cobrir o devtools do router. */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}
