import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { handleMutationError } from "../../../common/utils/api-error";
import type { GetApplicationResponse } from "../http/get-application.http";
import { updateApplication, type UpdateApplicationBody } from "../http/update-application.http";
import {
  updateApplicationSchema,
  type UpdateApplicationField,
  type UpdateApplicationFormValues,
} from "../schemas/update-application.schema";
import { toApplicationBody, toUpdateFormValues } from "../utils/application-form";

const emptyValues = {
  company: "",
  role: "",
  job_url: "",
  source: "",
  applied_at: "",
  resume_id: "",
  salary: "",
  work_model: "",
  location: "",
  contacts: "",
  notes: "",
} satisfies UpdateApplicationFormValues;

/**
 * Edição no lugar dos dados da candidatura (painel de detalhe): cada campo é salvo sozinho, com
 * `saveField(nome)`, ao sair do campo ou com `Enter`.
 */
export const useUpdateApplicationForm = (application: GetApplicationResponse | undefined) => {
  const form = useForm<UpdateApplicationFormValues>({
    resolver: zodResolver(updateApplicationSchema),
    defaultValues: emptyValues,
    // Quando a candidatura muda, o formulário acompanha, sem apagar o que a pessoa está digitando.
    values: application ? toUpdateFormValues(application) : undefined,
    resetOptions: { keepDirtyValues: true },
  });

  const mutation = useMutation({
    mutationFn: updateApplication,
    onError: handleMutationError,
    onSuccess: () => {
      // Configurado, ainda sem ação (ex.: atualizar o cache, mostrar o sinal de "salvo").
    },
  });

  // Último valor conhecido no servidor de cada campo: o que veio da API ou o que acabou de ser
  // salvo. É com ele que se decide se um campo mudou (e precisa ser salvo).
  const saved = useRef<Partial<UpdateApplicationFormValues>>({});

  useEffect(() => {
    saved.current = application ? toUpdateFormValues(application) : {};
  }, [application]);

  /** Valida e salva um campo, só se ele mudou. */
  const saveField = async (name: UpdateApplicationField) => {
    if (!application) return;
    if (!(await form.trigger(name))) return;

    const value = form.getValues(name);
    if (value === saved.current[name]) return;

    const body = { [name]: toApplicationBody(form.getValues())[name] } as UpdateApplicationBody;

    try {
      await mutation.mutateAsync({ id: application.id, body });
      saved.current = { ...saved.current, [name]: value };
    } catch {
      // Já tratado no onError da mutation (toast); o campo continua alterado.
    }
  };

  return { ...form, saveField, isPending: mutation.isPending };
};
