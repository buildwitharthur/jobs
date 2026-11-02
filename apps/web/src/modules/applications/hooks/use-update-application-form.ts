import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { handleMutationError } from "../../../common/utils/api-error";
import { resumesQueryKey } from "../../resumes/hooks/use-resumes";
import type { ListResumesResponse } from "../../resumes/http/list-resumes.http";
import type { GetApplicationResponse } from "../http/get-application.http";
import type { GetBoardResponse } from "../http/get-board.http";
import { updateApplication, type UpdateApplicationBody } from "../http/update-application.http";
import { updateCard } from "../utils/board";
import { applicationQueryKey } from "./use-application";
import { boardQueryKey } from "./use-board";
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

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateApplication,
    onError: handleMutationError,
    onSuccess: (updated) => {
      // O card do kanban mostra alguns desses dados: atualiza no cache, sem buscar o kanban.
      const resumeName =
        queryClient
          .getQueryData<ListResumesResponse>(resumesQueryKey())
          ?.find((resume) => resume.id === updated.resume_id)?.name ?? null;
      queryClient.setQueryData<GetBoardResponse>(boardQueryKey(), (board) =>
        board
          ? updateCard(board, updated.id, (card) => ({
              ...card,
              company: updated.company,
              role: updated.role,
              applied_at: updated.applied_at,
              work_model: updated.work_model,
              resume_name: resumeName,
            }))
          : board,
      );
      void queryClient.invalidateQueries({ queryKey: applicationQueryKey(updated.id) });
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
