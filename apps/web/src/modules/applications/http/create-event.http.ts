import { apiClient } from "../../../common/lib/api-client";
import type { paths } from "../../../common/lib/api-schema";

type Operation = paths["/applications/{id}/events"]["post"];

export type CreateEventBody = NonNullable<Operation["requestBody"]>["content"]["application/json"];
export type CreateEventResponse = Operation["responses"][201]["content"]["application/json"];
export type CreateEventVariables = { applicationId: number; body: CreateEventBody };

/** POST /applications/:id/events: adiciona uma nota ao histórico, sem mudar o status. */
export const createEvent = async ({ applicationId, body }: CreateEventVariables) => {
  const { data } = await apiClient.post<CreateEventResponse>(
    `/applications/${applicationId}/events`,
    body,
  );
  return data;
};
