import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { handleMutationError } from "../../../common/utils/api-error";
import { createSubmit } from "../../../common/utils/submit";
import { createResume } from "../http/create-resume.http";
import { createResumeSchema, type CreateResumeFormValues } from "../schemas/create-resume.schema";

/** Formulário de novo currículo: nome, descrição e o PDF. */
export const useCreateResumeForm = () => {
  const form = useForm<CreateResumeFormValues>({
    resolver: zodResolver(createResumeSchema),
    defaultValues: { name: "", description: "" },
  });

  const mutation = useMutation({
    mutationFn: createResume,
    onError: handleMutationError,
    onSuccess: () => {
      // Configurado, ainda sem ação (ex.: atualizar a lista de currículos, avisar).
    },
  });

  const submit = createSubmit(form.handleSubmit, async ({ name, description, file }) => {
    await mutation.mutateAsync({ name, description: description || undefined, file });
  });

  return { ...form, submit, isPending: mutation.isPending };
};
