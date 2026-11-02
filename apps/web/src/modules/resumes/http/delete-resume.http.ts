import { apiClient } from "../../../common/lib/api-client";

/** DELETE /resumes/:id: só exclui currículo sem candidaturas (senão a API responde 409). */
export const deleteResume = async (id: number) => {
  await apiClient.delete(`/resumes/${id}`);
};
