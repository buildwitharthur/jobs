import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleMutationError } from "../../../common/utils/api-error";
import { deleteEvent } from "../http/delete-event.http";
import { refreshApplication } from "../utils/application-cache";

/** Exclui um evento do histórico (o de criação não pode ser excluído). */
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEvent,
    onError: handleMutationError,
    onSuccess: (_data, { applicationId }) => refreshApplication(queryClient, applicationId),
  });
};
