import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { handleMutationError } from "../../../common/utils/api-error";
import { createSubmit } from "../../../common/utils/submit";
import { createApplication } from "../http/create-application.http";
import {
  createApplicationSchema,
  type CreateApplicationFormValues,
} from "../schemas/create-application.schema";
import { applicationFormDefaults, toApplicationBody } from "../utils/application-form";

/** Formulário de nova candidatura (modal "Nova candidatura"). */
export const useCreateApplicationForm = () => {
  const form = useForm<CreateApplicationFormValues>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: applicationFormDefaults(),
  });

  const mutation = useMutation({
    mutationFn: createApplication,
    onError: handleMutationError,
    onSuccess: () => {
      // Configurado, ainda sem ação (ex.: atualizar o cache, fechar o modal, avisar).
    },
  });

  const submit = createSubmit(form.handleSubmit, async (values) => {
    await mutation.mutateAsync(toApplicationBody(values));
  });

  return { ...form, submit, isPending: mutation.isPending };
};
