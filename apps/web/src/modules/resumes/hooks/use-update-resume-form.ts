import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { handleMutationError } from "../../../common/utils/api-error";
import type { ListResumesResponse } from "../http/list-resumes.http";
import { updateResume } from "../http/update-resume.http";
import { updateResumeSchema, type UpdateResumeFormValues } from "../schemas/update-resume.schema";

type Resume = ListResumesResponse[number];

const toFormValues = (resume: Resume): UpdateResumeFormValues => ({
  name: resume.name,
  description: resume.description ?? "",
});

/**
 * Edição no lugar do nome e da descrição de um currículo: cada campo é salvo sozinho, com
 * `saveField(nome)`, ao sair do campo ou com `Enter`.
 */
export const useUpdateResumeForm = (resume: Resume | undefined) => {
  const form = useForm<UpdateResumeFormValues>({
    resolver: zodResolver(updateResumeSchema),
    defaultValues: { name: "", description: "" },
    // Quando o currículo muda, o formulário acompanha, sem apagar o que a pessoa está digitando.
    values: resume ? toFormValues(resume) : undefined,
    resetOptions: { keepDirtyValues: true },
  });

  const mutation = useMutation({
    mutationFn: updateResume,
    onError: handleMutationError,
    onSuccess: () => {
      // Configurado, ainda sem ação (ex.: atualizar a lista de currículos, mostrar "salvo").
    },
  });

  // Último valor conhecido no servidor de cada campo: o que veio da API ou o que acabou de ser
  // salvo. É com ele que se decide se um campo mudou (e precisa ser salvo).
  const saved = useRef<Partial<UpdateResumeFormValues>>({});

  useEffect(() => {
    saved.current = resume ? toFormValues(resume) : {};
  }, [resume]);

  /** Valida e salva um campo, só se ele mudou. */
  const saveField = async (name: keyof UpdateResumeFormValues) => {
    if (!resume) return;
    if (!(await form.trigger(name))) return;

    const value = form.getValues(name);
    if (value === saved.current[name]) return;

    try {
      await mutation.mutateAsync({
        id: resume.id,
        body: { [name]: name === "description" ? value || null : value },
      });
      saved.current = { ...saved.current, [name]: value };
    } catch {
      // Já tratado no onError da mutation (toast); o campo continua alterado.
    }
  };

  return { ...form, saveField, isPending: mutation.isPending };
};
