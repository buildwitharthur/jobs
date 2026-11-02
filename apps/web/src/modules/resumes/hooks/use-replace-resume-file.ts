import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleMutationError } from "../../../common/utils/api-error";
import type { ListResumesResponse } from "../http/list-resumes.http";
import { replaceResumeFile } from "../http/replace-resume-file.http";
import { resumesQueryKey } from "./use-resumes";

/**
 * Troca o PDF de um currículo (o arquivo antigo é apagado). O currículo atualizado entra na lista
 * no cache, sem buscar a lista de novo.
 */
export const useReplaceResumeFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: replaceResumeFile,
    onError: handleMutationError,
    onSuccess: (updated) => {
      queryClient.setQueryData<ListResumesResponse>(resumesQueryKey(), (resumes) =>
        resumes?.map((resume) => (resume.id === updated.id ? { ...resume, ...updated } : resume)),
      );
      toast.success("Arquivo do currículo trocado.");
    },
  });
};
