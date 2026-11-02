import { apiClient } from "../../../common/lib/api-client";
import type { paths } from "../../../common/lib/api-schema";

type Operation = paths["/dashboard"]["get"];

export type GetDashboardResponse = Operation["responses"][200]["content"]["application/json"];

/** GET /dashboard: totais, contagem por status, candidaturas dos últimos 30 dias e eventos recentes. */
export const getDashboard = async () => {
  const { data } = await apiClient.get<GetDashboardResponse>("/dashboard");
  return data;
};
