import type { GetBoardResponse } from "../http/get-board.http";

export type BoardColumn = GetBoardResponse["columns"][number];
export type BoardCard = BoardColumn["cards"][number];
export type Status = BoardColumn["status"];

/**
 * Move um card para a coluna de outro status, no topo (é o evento mais recente) e com as
 * contagens das colunas ajustadas. Não altera o kanban recebido.
 */
export const moveCard = (board: GetBoardResponse, id: number, status: Status): GetBoardResponse => {
  const card = board.columns.flatMap((column) => column.cards).find((item) => item.id === id);
  if (!card) return board;

  const moved = { ...card, last_event_at: new Date().toISOString() };

  return {
    columns: board.columns.map((column) => {
      const cards = column.cards.filter((item) => item.id !== id);
      if (column.status === status) cards.unshift(moved);
      return { ...column, cards, count: cards.length };
    }),
  };
};
