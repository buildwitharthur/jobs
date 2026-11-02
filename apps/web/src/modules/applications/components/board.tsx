import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { toast } from "sonner";
import { useBoard } from "../hooks/use-board";
import { useChangeApplicationStatus } from "../hooks/use-change-application-status";
import { useStatuses } from "../hooks/use-statuses";
import type { BoardCard as BoardCardData, Status } from "../utils/board";
import { BoardCardOverlay } from "./board-card";
import { BoardColumn } from "./board-column";

type DraggedCard = { card: BoardCardData; status: Status };

const BOARD_CLASSES =
  // O ::after faz a margem direita aparecer no fim da rolagem lateral.
  "gap-sm px-xl pb-xl flex h-full after:shrink-0 after:basis-[calc(var(--spacing-xl)-var(--spacing-sm))] after:content-['']";

/** Kanban (ui.md, Tela 1): uma coluna por status; arrastar um card muda o status dele. */
export function Board() {
  const { data: board } = useBoard();
  const { data: statuses = [] } = useStatuses();
  const { mutate: changeStatus } = useChangeApplicationStatus();
  const [expanded, setExpanded] = useState<Status[]>([]);
  const [dragged, setDragged] = useState<DraggedCard | null>(null);

  // Arrasta só depois de 4px: um clique no card continua sendo clique.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  const isClosed = (status: Status) =>
    statuses.some((item) => item.value === status && item.type === "closed");

  const toggle = (status: Status) =>
    setExpanded((current) =>
      current.includes(status) ? current.filter((item) => item !== status) : [...current, status],
    );

  const handleDragStart = ({ active }: DragStartEvent) =>
    setDragged(active.data.current as DraggedCard);

  const handleDragEnd = ({ over }: DragEndEvent) => {
    setDragged(null);
    const to = over?.id as Status | undefined;
    if (!dragged || !to || to === dragged.status) return;

    const { card, status: from } = dragged;
    const label = board.columns.find((column) => column.status === to)?.label;
    changeStatus({ id: card.id, body: { status: to } });
    toast.info(`${card.company} foi para ${label}`, {
      action: {
        label: "Desfazer",
        onClick: () => changeStatus({ id: card.id, body: { status: from } }),
      },
    });
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setDragged(null)}
    >
      <div className={BOARD_CLASSES}>
        {board.columns.map((column) => {
          const closed = isClosed(column.status);
          return (
            <BoardColumn
              key={column.status}
              column={column}
              closed={closed}
              collapsed={closed && !expanded.includes(column.status)}
              onToggle={() => toggle(column.status)}
            />
          );
        })}
      </div>
      <DragOverlay>
        {dragged && <BoardCardOverlay card={dragged.card} status={dragged.status} />}
      </DragOverlay>
    </DndContext>
  );
}

/** Formato do kanban enquanto ele carrega (ui.md: estados de carregamento). */
export function BoardSkeleton() {
  return (
    <div className={BOARD_CLASSES} aria-hidden>
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="basis-column-min max-w-column-max bg-surface-sunken flex shrink-0 grow flex-col rounded-lg"
        >
          <div className="pt-xs pr-xs pb-sm pl-sm">
            <span className="bg-surface-sunken block h-4 w-30 rounded-sm" />
          </div>
          <div className="gap-xs px-xs pb-xs flex flex-col">
            <div className="bg-surface h-19 rounded-md opacity-70" />
            <div className="bg-surface h-19 rounded-md opacity-70" />
          </div>
        </div>
      ))}
    </div>
  );
}
