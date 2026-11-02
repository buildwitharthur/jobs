import { apiClient } from "../../../common/lib/api-client";
import type { paths } from "../../../common/lib/api-schema";

type Operation = paths["/applications/{id}"]["patch"];

export type UpdateApplicationBody = NonNullable<
  Operation["requestBody"]
>["content"]["application/json"];
export type UpdateApplicationResponse = Operation["responses"][200]["content"]["application/json"];
export type UpdateApplicationVariables = { id: number; body: UpdateApplicationBody };

/** PATCH /applications/:id: edita os dados. Não altera o status (use changeApplicationStatus). */
export const updateApplication = async ({ id, body }: UpdateApplicationVariables) => {
  const { data } = await apiClient.patch<UpdateApplicationResponse>(`/applications/${id}`, body);
  return data;
};
