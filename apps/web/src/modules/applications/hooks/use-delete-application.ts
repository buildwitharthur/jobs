import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleMutationError } from "../../../common/utils/api-error";
import { deleteApplication } from "../http/delete-application.http";
import type { GetApplicationResponse } from "../http/get-application.http";
import type { GetBoardResponse } from "../http/get-board.http";
import { removeCard } from "../utils/board";
import { applicationQueryKey } from "./use-application";
import { boardQueryKey } from "./use-board";

/**
 * Exclui uma candidatura. O card sai do kanban no cache (sem buscar o kanban), e com ele o painel
 * de detalhe, que fecha sozinho. A contagem "usado em N candidaturas" dos currículos é buscada de
 * novo.
 */
export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApplication,
    onError: handleMutationError,
    onSuccess: (_data, id) => {
      const company = queryClient.getQueryData<GetApplicationResponse>(
        applicationQueryKey(id),
      )?.company;

      queryClient.setQueryData<GetBoardResponse>(boardQueryKey(), (board) =>
        board ? removeCard(board, id) : board,
      );
      queryClient.removeQueries({ queryKey: applicationQueryKey(id) });
      void queryClient.invalidateQueries({ queryKey: ["resumes"] });

      // O aviso fica no hook: o painel que pediu a exclusão já não existe quando ela termina.
      toast.info(company ? `Candidatura em ${company} excluída.` : "Candidatura excluída.");
    },
  });
};
