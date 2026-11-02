import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { handleMutationError } from "../../../common/utils/api-error";
import { createSubmit } from "../../../common/utils/submit";
import { createApplication, type CreateApplicationBody } from "../http/create-application.http";
import {
  quickCreateApplicationSchema,
  type QuickCreateApplicationFormValues,
} from "../schemas/quick-create-application.schema";

/**
 * Formulário rápido do "+" de uma coluna do kanban: só empresa e cargo, e a candidatura já nasce
 * com o status da coluna.
 */
export const useQuickCreateApplicationForm = (status: string) => {
  const form = useForm<QuickCreateApplicationFormValues>({
    resolver: zodResolver(quickCreateApplicationSchema),
    defaultValues: { company: "", role: "" },
  });

  const mutation = useMutation({
    mutationFn: createApplication,
    onError: handleMutationError,
    onSuccess: () => {
      // Configurado, ainda sem ação (ex.: atualizar o cache, limpar os campos, destacar o card).
    },
  });

  const submit = createSubmit(form.handleSubmit, async ({ company, role }) => {
    await mutation.mutateAsync({
      company,
      role,
      status: status as CreateApplicationBody["status"],
    });
  });

  return { ...form, submit, isPending: mutation.isPending };
};
