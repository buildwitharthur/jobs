import type { ComponentProps } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Clock, FileText } from "lucide-react";
import { cn } from "../../../common/utils/cn";
import { formatDateTime, relativeTime } from "../../../common/utils/date";
import type { BoardCard as BoardCardData, Status } from "../utils/board";
import { findWorkModel } from "../utils/work-models";
import { ApplicationSheet } from "./application-sheet";

type BoardCardProps = {
  card: BoardCardData;
  status: Status;
};

/**
 * Card de uma candidatura no kanban (design.md: application-card). Arrastável; um clique abre o
 * painel de detalhe.
 */
export function BoardCard({ card, status }: BoardCardProps) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: card.id,
    data: { card, status },
  });

  return (
    <ApplicationSheet card={card}>
      <CardBody
        ref={setNodeRef}
        card={card}
        status={status}
        // Com o painel aberto, o card fica marcado (design.md: card aberto).
        className={cn(
          "data-[state=open]:ring-primary data-[state=open]:ring-2",
          isDragging && "opacity-40",
        )}
        {...attributes}
        {...listeners}
      />
    </ApplicationSheet>
  );
}

/** O card que acompanha o ponteiro enquanto é arrastado (design.md: application-card-dragging). */
export function BoardCardOverlay({ card, status }: BoardCardProps) {
  return <CardBody card={card} status={status} className="shadow-dragging rotate-2" />;
}

function CardBody({
  card,
  status,
  className,
  ...props
}: BoardCardProps & ComponentProps<"article">) {
  const workModel = findWorkModel(card.work_model);

  return (
    <article
      data-status={status}
      aria-label={`${card.company}, ${card.role}`}
      className={cn(
        "border-border bg-surface relative flex cursor-pointer flex-col gap-0.5 rounded-md border",
        "p-sm hover:shadow-raised pl-[calc(var(--spacing-sm)+3px)] transition-shadow",
        // Faixa da cor do status na borda esquerda.
        "before:absolute before:-inset-y-px before:-left-px before:w-[3px] before:rounded-l-md",
        "before:bg-status-accent before:content-['']",
        className,
      )}
      {...props}
    >
      <span className="truncate font-medium">{card.company}</span>
      <span className="text-text-secondary">{card.role}</span>
      <span className="mt-xxs gap-x-sm text-caption text-text-muted flex flex-wrap items-center gap-y-1 [&_svg]:size-3">
        {workModel && (
          <span className="inline-flex items-center gap-1" title={workModel.label}>
            <workModel.icon aria-hidden />
            {workModel.label}
          </span>
        )}
        {card.resume_name && (
          <span className="inline-flex items-center gap-1">
            <FileText aria-hidden />
            {card.resume_name}
          </span>
        )}
        <span
          className="inline-flex items-center gap-1"
          title={`Último evento: ${formatDateTime(card.last_event_at)}`}
        >
          <Clock aria-hidden />
          {relativeTime(card.last_event_at)}
        </span>
      </span>
    </article>
  );
}
