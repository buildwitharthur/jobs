import { apiClient } from "../../../common/lib/api-client";
import type { paths } from "../../../common/lib/api-schema";

type Operation = paths["/applications/{id}/status"]["patch"];

export type ChangeApplicationStatusBody = NonNullable<
  Operation["requestBody"]
>["content"]["application/json"];
export type ChangeApplicationStatusResponse =
  Operation["responses"][200]["content"]["application/json"];
export type ChangeApplicationStatusVariables = { id: number; body: ChangeApplicationStatusBody };

/** PATCH /applications/:id/status: muda o status e registra o evento `status_change`. */
export const changeApplicationStatus = async ({ id, body }: ChangeApplicationStatusVariables) => {
  const { data } = await apiClient.patch<ChangeApplicationStatusResponse>(
    `/applications/${id}/status`,
    body,
  );
  return data;
};
