import { apiClient } from "../../../common/lib/api-client";
import type { paths } from "../../../common/lib/api-schema";

type Operation = paths["/statuses"]["get"];

export type GetStatusesResponse = Operation["responses"][200]["content"]["application/json"];

/** GET /statuses: a lista fixa de status, na ordem das colunas do kanban (rótulo e tipo). */
export const getStatuses = async () => {
  const { data } = await apiClient.get<GetStatusesResponse>("/statuses");
  return data;
};
