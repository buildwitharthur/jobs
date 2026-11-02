import { apiClient } from "../../../common/lib/api-client";
import type { paths } from "../../../common/lib/api-schema";

type Operation = paths["/applications"]["get"];

export type ListApplicationsQuery = NonNullable<Operation["parameters"]["query"]>;
export type ListApplicationsResponse = Operation["responses"][200]["content"]["application/json"];

/** GET /applications: lista com filtros, busca e ordenação. */
export const listApplications = async (query?: ListApplicationsQuery) => {
  const { data } = await apiClient.get<ListApplicationsResponse>("/applications", {
    params: query,
  });
  return data;
};
