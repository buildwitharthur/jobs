import { useState, type ComponentProps, type ReactNode } from "react";
import { ArrowRight, CirclePlus, Clock, MessageSquare, Pencil, Trash2 } from "lucide-react";
import { DeleteAlert } from "../../../common/components/ui/alert-dialog";
import { Button } from "../../../common/components/ui/button";
import { StatusBadge } from "../../../common/components/ui/badge";
import { Input } from "../../../common/components/ui/input";
import { Textarea } from "../../../common/components/ui/textarea";
import { cn } from "../../../common/utils/cn";
import { formatDateTime, relativeTime, toDateTimeLocal } from "../../../common/utils/date";
import { useCreateEventForm } from "../hooks/use-create-event-form";
import { useDeleteEvent } from "../hooks/use-delete-event";
import { useStatuses } from "../hooks/use-statuses";
import { useUpdateEventForm } from "../hooks/use-update-event-form";
import type { GetApplicationResponse } from "../http/get-application.http";
import { Kbd } from "./kbd";

type ApplicationEvent = GetApplicationResponse["events"][number];

const EVENT_ICONS = { created: CirclePlus, status_change: ArrowRight, note: MessageSquare };

/** Histórico da candidatura: o campo "Adicionar nota" e os eventos, do mais recente ao mais antigo. */
export function ApplicationHistory({ application }: { application: GetApplicationResponse }) {
  const {
    register,
    setValue,
    submit,
    formState: { errors },
  } = useCreateEventForm(application.id);
  const { data: statuses = [] } = useStatuses();
  // "agora" ou uma data escolhida (registro retroativo).
  const [pickDate, setPickDate] = useState(false);

  const label = (status: string | null) =>
    statuses.find((item) => item.value === status)?.label ?? status;

  const badge = (status: string | null) =>
    status && <StatusBadge status={status}>{label(status)}</StatusBadge>;

  const resetToNow = () => {
    setValue("occurred_at", "");
    setPickDate(false);
  };

  return (
    <>
      <h3 className="text-heading mt-xl mb-xs">Histórico</h3>

      <form
        onSubmit={async (event) => {
          await submit(event);
          setPickDate(false);
        }}
        className="mb-md gap-xxs flex flex-col"
      >
        <Input
          placeholder="Adicionar nota (entrevista marcada, feedback...)"
          autoComplete="off"
          aria-label="Adicionar nota"
          aria-invalid={!!errors.note}
          {...register("note")}
        />
        {errors.note && (
          <span className="text-caption text-danger-text">{errors.note.message}</span>
        )}
        <div className="gap-xs text-caption text-text-muted flex items-center [&_svg]:size-3">
          <Clock aria-hidden />
          {pickDate ? (
            <>
              <Input
                type="datetime-local"
                className="w-auto"
                aria-label="Data da nota"
                {...register("occurred_at")}
              />
              <LinkButton onClick={resetToNow}>usar agora</LinkButton>
            </>
          ) : (
            <LinkButton
              onClick={() => {
                setValue("occurred_at", toDateTimeLocal(new Date().toISOString()));
                setPickDate(true);
              }}
              title="Registrar com outra data"
            >
              agora
            </LinkButton>
          )}
          <span>
            <Kbd>Enter</Kbd> salva
          </span>
        </div>
      </form>

      <ol>
        {application.events.map((event, index) => (
          <EventItem
            key={event.id}
            applicationId={application.id}
            event={event}
            last={index === application.events.length - 1}
            badge={badge}
          />
        ))}
      </ol>
    </>
  );
}

type EventItemProps = {
  applicationId: number;
  event: ApplicationEvent;
  last: boolean;
  badge: (status: string | null) => ReactNode;
};

function EventItem({ applicationId, event, last, badge }: EventItemProps) {
  const Icon = EVENT_ICONS[event.type];
  const [editing, setEditing] = useState(false);
  const { mutate: deleteEvent } = useDeleteEvent();

  return (
    <li
      className={cn(
        "group gap-xs py-xs relative grid grid-cols-[28px_1fr_auto]",
        // Linha que liga um evento ao próximo.
        !last &&
          "before:bg-border before:absolute before:top-9 before:-bottom-2 before:left-[13px]",
        !last && "before:w-px before:content-['']",
      )}
    >
      <span className="border-border bg-surface text-text-secondary flex size-7 items-center justify-center rounded-full border">
        <Icon className="size-4" aria-hidden />
      </span>
      {editing ? (
        <EventEditor
          applicationId={applicationId}
          event={event}
          onClose={() => setEditing(false)}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 pt-1">
            {event.type === "created" && (
              <>
                <span>Candidatura criada em</span>
                {badge(event.to_status)}
              </>
            )}
            {event.type === "status_change" && (
              <>
                {badge(event.from_status)}
                <ArrowRight className="text-text-muted size-4" aria-hidden />
                {badge(event.to_status)}
              </>
            )}
            {event.note && (
              <p className="w-full [overflow-wrap:anywhere] whitespace-pre-wrap">{event.note}</p>
            )}
            <span
              className="text-caption text-text-muted w-full"
              title={formatDateTime(event.occurred_at)}
            >
              {formatDateTime(event.occurred_at)} · {relativeTime(event.occurred_at)}
            </span>
          </div>
          {/* Editar e excluir aparecem só com o mouse em cima (ou com o foco). */}
          <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditing(true)}
              aria-label="Editar evento"
              title="Editar"
            >
              <Pencil aria-hidden />
            </Button>
            {event.type !== "created" && (
              <DeleteAlert
                title="Excluir evento?"
                description="O evento sai do histórico. O status atual da candidatura não muda."
                onConfirm={() => deleteEvent({ applicationId, eventId: event.id })}
              >
                <Button variant="danger" size="icon" aria-label="Excluir evento" title="Excluir">
                  <Trash2 aria-hidden />
                </Button>
              </DeleteAlert>
            )}
          </div>
        </>
      )}
    </li>
  );
}

type EventEditorProps = {
  applicationId: number;
  event: ApplicationEvent;
  onClose: () => void;
};

/** Edição da nota e da data de um evento, no lugar dele. `Enter` salva; `Esc` cancela. */
function EventEditor({ applicationId, event, onClose }: EventEditorProps) {
  const {
    register,
    submit,
    formState: { errors },
  } = useUpdateEventForm(applicationId, event, onClose);

  return (
    <form
      onSubmit={submit}
      // Marca a edição para o `Esc` cancelar só ela, sem fechar o painel.
      data-event-edit
      onKeyDown={(keyEvent) => {
        if (keyEvent.key === "Escape") onClose();
        if (keyEvent.key === "Enter" && !keyEvent.shiftKey) {
          keyEvent.preventDefault();
          void submit();
        }
      }}
      className="gap-xxs col-span-2 flex flex-col"
    >
      <Textarea
        autoFocus
        rows={2}
        placeholder={event.type === "note" ? "Escreva a nota" : "Nota opcional"}
        aria-label="Nota"
        aria-invalid={!!errors.note}
        {...register("note")}
      />
      {errors.note && <span className="text-caption text-danger-text">{errors.note.message}</span>}
      <Input
        type="datetime-local"
        className="w-auto self-start"
        aria-label="Data do evento"
        aria-invalid={!!errors.occurred_at}
        {...register("occurred_at")}
      />
      <span className="text-caption text-text-muted">
        <Kbd>Enter</Kbd> salva · <Kbd>Esc</Kbd> cancela
      </span>
    </form>
  );
}

function LinkButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn("text-caption text-primary-text cursor-pointer hover:underline", className)}
      {...props}
    />
  );
}
