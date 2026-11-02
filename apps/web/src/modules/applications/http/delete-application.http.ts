import { apiClient } from "../../../common/lib/api-client";

/** DELETE /applications/:id: exclui a candidatura e todos os eventos dela. */
export const deleteApplication = async (id: number) => {
  await apiClient.delete(`/applications/${id}`);
};
