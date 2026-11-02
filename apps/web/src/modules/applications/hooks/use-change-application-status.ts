import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleMutationError } from "../../../common/utils/api-error";
import type { GetApplicationResponse } from "../http/get-application.http";
import type { GetBoardResponse } from "../http/get-board.http";
import { changeApplicationStatus } from "../http/change-application-status.http";
import { moveCard } from "../utils/board";
import { applicationQueryKey } from "./use-application";
import { boardQueryKey } from "./use-board";

/**
 * Muda o status de uma candidatura. O card muda de coluna no cache do kanban (e o status muda no
 * detalhe, se ele estiver aberto) na hora, antes da resposta da API, e tudo volta se ela falhar.
 * O kanban não é buscado de novo; o detalhe é, para trazer o evento novo do histórico.
 */
export const useChangeApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeApplicationStatus,
    onMutate: ({ id, body }) => {
      const previousBoard = queryClient.getQueryData<GetBoardResponse>(boardQueryKey());
      const previousDetail = queryClient.getQueryData<GetApplicationResponse>(
        applicationQueryKey(id),
      );
      if (previousBoard) {
        queryClient.setQueryData(boardQueryKey(), moveCard(previousBoard, id, body.status));
      }
      if (previousDetail) {
        queryClient.setQueryData(applicationQueryKey(id), {
          ...previousDetail,
          status: body.status,
        });
      }
      return { previousBoard, previousDetail };
    },
    onError: (error, { id }, context) => {
      if (context?.previousBoard) queryClient.setQueryData(boardQueryKey(), context.previousBoard);
      if (context?.previousDetail) {
        queryClient.setQueryData(applicationQueryKey(id), context.previousDetail);
      }
      handleMutationError(error);
    },
    onSuccess: (_data, { id }) =>
      queryClient.invalidateQueries({ queryKey: applicationQueryKey(id) }),
  });
};
