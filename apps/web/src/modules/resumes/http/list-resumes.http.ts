import { apiClient } from "../../../common/lib/api-client";
import type { paths } from "../../../common/lib/api-schema";

type Operation = paths["/resumes"]["get"];

export type ListResumesResponse = Operation["responses"][200]["content"]["application/json"];

/** GET /resumes: do mais recente para o mais antigo, com a contagem de candidaturas de cada um. */
export const listResumes = async () => {
  const { data } = await apiClient.get<ListResumesResponse>("/resumes");
  return data;
};
