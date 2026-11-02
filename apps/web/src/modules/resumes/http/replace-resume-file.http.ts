import { apiClient } from "../../../common/lib/api-client";
import type { paths } from "../../../common/lib/api-schema";

type Operation = paths["/resumes/{id}/file"]["put"];

export type ReplaceResumeFileResponse = Operation["responses"][200]["content"]["application/json"];
export type ReplaceResumeFileVariables = { id: number; file: File };

/** PUT /resumes/:id/file (multipart/form-data): troca o PDF, mantendo os vínculos com as candidaturas. */
export const replaceResumeFile = async ({ id, file }: ReplaceResumeFileVariables) => {
  const form = new FormData();
  form.append("file", file);

  const { data } = await apiClient.put<ReplaceResumeFileResponse>(`/resumes/${id}/file`, form);
  return data;
};
