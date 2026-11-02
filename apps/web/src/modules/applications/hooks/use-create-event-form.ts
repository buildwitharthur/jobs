import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { handleMutationError } from "../../../common/utils/api-error";
import { createSubmit } from "../../../common/utils/submit";
import { createEvent } from "../http/create-event.http";
import { createEventSchema, type CreateEventFormValues } from "../schemas/create-event.schema";

/** Campo "Adicionar nota" do histórico da candidatura. */
export const useCreateEventForm = (applicationId: number | undefined) => {
  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: { note: "", occurred_at: "" },
  });

  const mutation = useMutation({
    mutationFn: createEvent,
    onError: handleMutationError,
    onSuccess: () => {
      // Configurado, ainda sem ação (ex.: atualizar o histórico, limpar o campo).
    },
  });

  const submit = createSubmit(form.handleSubmit, async ({ note, occurred_at }) => {
    if (applicationId === undefined) return;

    await mutation.mutateAsync({
      applicationId,
      body: { note, occurred_at: occurred_at ? new Date(occurred_at).toISOString() : undefined },
    });
  });

  return { ...form, submit, isPending: mutation.isPending };
};
