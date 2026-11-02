import { apiClient } from "../../../common/lib/api-client";
import type { paths } from "../../../common/lib/api-schema";

type Operation = paths["/resumes/{id}/applications"]["get"];

export type ListResumeApplicationsResponse =
  Operation["responses"][200]["content"]["application/json"];

/** GET /resumes/:id/applications: as candidaturas que usaram o currículo. */
export const listResumeApplications = async (id: number) => {
  const { data } = await apiClient.get<ListResumeApplicationsResponse>(
    `/resumes/${id}/applications`,
  );
  return data;
};
