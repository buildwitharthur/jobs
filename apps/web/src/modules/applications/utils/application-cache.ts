import type { QueryClient } from "@tanstack/react-query";
import { applicationQueryKey } from "../hooks/use-application";
import { boardQueryKey } from "../hooks/use-board";
import type { GetApplicationResponse } from "../http/get-application.http";
import type { GetBoardResponse } from "../http/get-board.http";
import { updateCard } from "./board";

/**
 * Depois de mexer no histórico (nota nova, evento editado ou excluído): busca o detalhe de novo e
 * acerta o "há 3 dias" do card do kanban pelo evento mais recente, no cache, sem buscar o kanban.
 */
export const refreshApplication = async (queryClient: QueryClient, id: number) => {
  await queryClient.invalidateQueries({ queryKey: applicationQueryKey(id) });

  const lastEventAt = queryClient.getQueryData<GetApplicationResponse>(applicationQueryKey(id))
    ?.events[0]?.occurred_at;
  if (!lastEventAt) return;

  queryClient.setQueryData<GetBoardResponse>(boardQueryKey(), (board) =>
    board ? updateCard(board, id, (card) => ({ ...card, last_event_at: lastEventAt })) : board,
  );
};
