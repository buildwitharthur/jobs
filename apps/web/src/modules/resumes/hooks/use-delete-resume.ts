import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleMutationError } from "../../../common/utils/api-error";
import { deleteResume } from "../http/delete-resume.http";
import type { ListResumesResponse } from "../http/list-resumes.http";
import { resumeApplicationsQueryKey } from "./use-resume-applications";
import { resumesQueryKey } from "./use-resumes";

/**
 * Exclui um currículo sem candidaturas (com candidaturas, a API responde 409 e a mensagem dela
 * aparece no aviso). O currículo sai da lista no cache, sem buscar a lista de novo.
 */
export const useDeleteResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResume,
    onError: handleMutationError,
    onSuccess: (_data, id) => {
      const name = queryClient
        .getQueryData<ListResumesResponse>(resumesQueryKey())
        ?.find((resume) => resume.id === id)?.name;

      queryClient.setQueryData<ListResumesResponse>(resumesQueryKey(), (resumes) =>
        resumes?.filter((resume) => resume.id !== id),
      );
      queryClient.removeQueries({ queryKey: resumeApplicationsQueryKey(id) });

      // O aviso fica no hook: o card que pediu a exclusão já não existe quando ela termina.
      toast.info(name ? `Currículo ${name} excluído.` : "Currículo excluído.");
    },
  });
};
