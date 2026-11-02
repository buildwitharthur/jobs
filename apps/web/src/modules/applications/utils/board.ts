import type { GetBoardResponse } from "../http/get-board.http";

export type BoardColumn = GetBoardResponse["columns"][number];
export type BoardCard = BoardColumn["cards"][number];
export type Status = BoardColumn["status"];

/**
 * Altera um card onde ele estiver e reordena a coluna dele pelo evento mais recente. Não altera
 * o kanban recebido.
 */
export const updateCard = (
  board: GetBoardResponse,
  id: number,
  update: (card: BoardCard) => BoardCard,
): GetBoardResponse => ({
  columns: board.columns.map((column) => ({
    ...column,
    cards: column.cards
      .map((card) => (card.id === id ? update(card) : card))
      .sort((a, b) => b.last_event_at.localeCompare(a.last_event_at)),
  })),
});

/** Tira um card do kanban (candidatura excluída), ajustando a contagem da coluna. */
export const removeCard = (board: GetBoardResponse, id: number): GetBoardResponse => ({
  columns: board.columns.map((column) => {
    const cards = column.cards.filter((card) => card.id !== id);
    return { ...column, cards, count: cards.length };
  }),
});

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
