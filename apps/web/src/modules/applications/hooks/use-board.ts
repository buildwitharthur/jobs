import { useQuery } from "@tanstack/react-query";
import { getBoard, type GetBoardQuery } from "../http/get-board.http";

export const boardQueryKey = (query?: GetBoardQuery) => ["board", query] as const;

/** Kanban: candidaturas agrupadas por status. */
export const useBoard = (query?: GetBoardQuery) =>
  useQuery({
    queryKey: boardQueryKey(query),
    queryFn: () => getBoard(query),
  });
