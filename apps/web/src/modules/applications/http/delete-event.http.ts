import { apiClient } from "../../../common/lib/api-client";

export type DeleteEventVariables = { applicationId: number; eventId: number };

/** DELETE /applications/:id/events/:eventId: exclui um evento (o de criação não pode ser excluído). */
export const deleteEvent = async ({ applicationId, eventId }: DeleteEventVariables) => {
  await apiClient.delete(`/applications/${applicationId}/events/${eventId}`);
};
