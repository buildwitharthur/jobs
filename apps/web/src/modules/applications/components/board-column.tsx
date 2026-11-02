import { useDroppable } from "@dnd-kit/core";
import { ChevronRight } from "lucide-react";
import { StatusDot } from "../../../common/components/ui/badge";
import { Button } from "../../../common/components/ui/button";
import { cn } from "../../../common/utils/cn";
import type { BoardColumn as BoardColumnData } from "../utils/board";
import { BoardCard } from "./board-card";

type BoardColumnProps = {
  column: BoardColumnData;
  /** Coluna encerrada: pode ser recolhida. */
  closed: boolean;
  /** Recolhida: só o nome e a contagem, na vertical. */
  collapsed: boolean;
  onToggle: () => void;
};

// Coluna sob o card que está sendo arrastado.
const OVER = "ring-2 ring-inset ring-primary bg-primary-subtle";

/** Coluna do kanban (design.md: kanban-column e kanban-column-collapsed). Recebe cards soltos. */
export function BoardColumn({ column, closed, collapsed, onToggle }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.status });

  if (collapsed) {
    return (
      <button
        ref={setNodeRef}
        type="button"
        data-status={column.status}
        onClick={onToggle}
        title={`Abrir a coluna ${column.label}`}
        aria-label={`${column.label}: ${column.count}. Abrir coluna`}
        className={cn(
          "basis-column-collapsed gap-xs py-sm flex shrink-0 cursor-pointer flex-col items-center",
          "bg-surface-sunken text-status-text hover:ring-border rounded-lg transition-colors",
          "hover:ring-1 hover:ring-inset",
          isOver && OVER,
        )}
      >
        <StatusDot status={column.status} />
        <span className="text-label tabular-nums">{column.count}</span>
        <span className="font-semibold whitespace-nowrap [writing-mode:vertical-rl]">
          {column.label}
        </span>
      </button>
    );
  }

  return (
    <section
      ref={setNodeRef}
      aria-label={column.label}
      className={cn(
        "basis-column-min max-w-column-max flex max-h-full min-w-0 shrink-0 grow flex-col",
        "bg-surface-sunken rounded-lg transition-colors",
        isOver && OVER,
      )}
    >
      <header className="gap-xs pt-xs pr-xs pb-sm pl-sm flex items-center">
        <StatusDot status={column.status} />
        <h2 className="text-heading min-w-0 flex-1 truncate">{column.label}</h2>
        <span className="text-caption text-text-secondary tabular-nums">{column.count}</span>
        {closed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            aria-label="Recolher coluna"
            title="Recolher coluna"
          >
            <ChevronRight aria-hidden />
          </Button>
        )}
      </header>
      <div className="gap-xs px-xs pb-xs flex min-h-12 flex-col overflow-y-auto">
        {column.cards.length > 0 ? (
          column.cards.map((card) => <BoardCard key={card.id} card={card} status={column.status} />)
        ) : (
          <p className="border-border px-xs py-md text-caption text-text-secondary rounded-md border border-dashed text-center">
            Arraste um card para cá
          </p>
        )}
      </div>
    </section>
  );
}
