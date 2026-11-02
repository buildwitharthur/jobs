import { apiClient } from "../../../common/lib/api-client";
import type { paths } from "../../../common/lib/api-schema";

type Operation = paths["/applications"]["post"];

export type CreateApplicationBody = NonNullable<
  Operation["requestBody"]
>["content"]["application/json"];
export type CreateApplicationResponse = Operation["responses"][201]["content"]["application/json"];

/** POST /applications: cria a candidatura (e o evento `created` do histórico). */
export const createApplication = async (body: CreateApplicationBody) => {
  const { data } = await apiClient.post<CreateApplicationResponse>("/applications", body);
  return data;
};
