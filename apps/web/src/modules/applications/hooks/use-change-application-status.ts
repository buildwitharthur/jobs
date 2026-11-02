import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleMutationError } from "../../../common/utils/api-error";
import type { GetBoardResponse } from "../http/get-board.http";
import { changeApplicationStatus } from "../http/change-application-status.http";
import { moveCard } from "../utils/board";
import { boardQueryKey } from "./use-board";

/**
 * Muda o status de uma candidatura. O card muda de coluna no cache do kanban na hora, antes da
 * resposta da API, e volta para a coluna anterior se ela falhar. O kanban não é buscado de novo.
 */
export const useChangeApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeApplicationStatus,
    onMutate: ({ id, body }) => {
      const previous = queryClient.getQueryData<GetBoardResponse>(boardQueryKey());
      if (previous) queryClient.setQueryData(boardQueryKey(), moveCard(previous, id, body.status));
      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(boardQueryKey(), context.previous);
      handleMutationError(error);
    },
  });
};
