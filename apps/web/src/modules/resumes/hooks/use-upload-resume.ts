import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleMutationError } from "../../../common/utils/api-error";
import { createResume } from "../http/create-resume.http";
import type { ListResumesResponse } from "../http/list-resumes.http";
import { markNewResume } from "../utils/new-resume";
import { resumesQueryKey } from "./use-resumes";

/**
 * Cadastra um currículo direto de um PDF, sem formulário: o nome vem do nome do arquivo (sem
 * `.pdf`). O currículo novo entra no topo da lista no cache, sem buscar a lista de novo, e o card
 * dele foca o nome.
 */
export const useUploadResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      createResume({ name: file.name.replace(/\.pdf$/i, "").trim() || "Currículo", file }),
    onError: handleMutationError,
    onSuccess: (created) => {
      markNewResume(created.id);
      queryClient.setQueryData<ListResumesResponse>(resumesQueryKey(), (resumes) =>
        resumes ? [created, ...resumes] : resumes,
      );
      toast.success(`Currículo ${created.name} cadastrado. Ajuste o nome se quiser.`);
    },
  });
};
