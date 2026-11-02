import { apiClient } from "../../../common/lib/api-client";
import type { paths } from "../../../common/lib/api-schema";

type Operation = paths["/applications/{id}"]["get"];

export type GetApplicationResponse = Operation["responses"][200]["content"]["application/json"];

/** GET /applications/:id: a candidatura com o currículo e o histórico completo. */
export const getApplication = async (id: number) => {
  const { data } = await apiClient.get<GetApplicationResponse>(`/applications/${id}`);
  return data;
};
