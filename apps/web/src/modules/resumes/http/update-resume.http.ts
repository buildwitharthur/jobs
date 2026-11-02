import { apiClient } from "../../../common/lib/api-client";
import type { paths } from "../../../common/lib/api-schema";

type Operation = paths["/resumes/{id}"]["patch"];

export type UpdateResumeBody = NonNullable<Operation["requestBody"]>["content"]["application/json"];
export type UpdateResumeResponse = Operation["responses"][200]["content"]["application/json"];
export type UpdateResumeVariables = { id: number; body: UpdateResumeBody };

/** PATCH /resumes/:id: edita o nome e a descrição. Não altera o arquivo. */
export const updateResume = async ({ id, body }: UpdateResumeVariables) => {
  const { data } = await apiClient.patch<UpdateResumeResponse>(`/resumes/${id}`, body);
  return data;
};
