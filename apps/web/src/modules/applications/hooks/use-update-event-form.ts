import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { handleMutationError } from "../../../common/utils/api-error";
import { toDateTimeLocal } from "../../../common/utils/date";
import { createSubmit } from "../../../common/utils/submit";
import type { GetApplicationResponse } from "../http/get-application.http";
import { updateEvent } from "../http/update-event.http";
import {
  createUpdateEventSchema,
  type UpdateEventFormValues,
} from "../schemas/update-event.schema";

type ApplicationEvent = GetApplicationResponse["events"][number];

/** Edição da nota e da data de um evento do histórico. */
export const useUpdateEventForm = (applicationId: number, event: ApplicationEvent) => {
  const schema = useMemo(() => createUpdateEventSchema(event.type), [event.type]);

  const form = useForm<UpdateEventFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { note: event.note ?? "", occurred_at: toDateTimeLocal(event.occurred_at) },
  });

  const mutation = useMutation({
    mutationFn: updateEvent,
    onError: handleMutationError,
    onSuccess: () => {
      // Configurado, ainda sem ação (ex.: atualizar o histórico, fechar a edição).
    },
  });

  const submit = createSubmit(form.handleSubmit, async ({ note, occurred_at }) => {
    await mutation.mutateAsync({
      applicationId,
      eventId: event.id,
      body: { note: note || null, occurred_at: new Date(occurred_at).toISOString() },
    });
  });

  return { ...form, submit, isPending: mutation.isPending };
};
