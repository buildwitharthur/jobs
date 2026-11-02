import { useSuspenseQuery } from "@tanstack/react-query";
import { getBoard } from "../http/get-board.http";

export const boardQueryKey = () => ["board"] as const;

/**
 * Kanban: candidaturas agrupadas por status. É buscado uma vez só: depois disso, quem mexe no
 * kanban (ex.: arrastar um card) atualiza o cache, sem buscar de novo.
 */
export const useBoard = () =>
  useSuspenseQuery({
    queryKey: boardQueryKey(),
    queryFn: () => getBoard(),
    staleTime: Infinity,
  });
