import { apiClient } from "../../../common/lib/api-client";
import type { paths } from "../../../common/lib/api-schema";

type Operation = paths["/applications/{id}/events/{eventId}"]["patch"];

export type UpdateEventBody = NonNullable<Operation["requestBody"]>["content"]["application/json"];
export type UpdateEventResponse = Operation["responses"][200]["content"]["application/json"];
export type UpdateEventVariables = {
  applicationId: number;
  eventId: number;
  body: UpdateEventBody;
};

/** PATCH /applications/:id/events/:eventId: corrige a nota ou a data de um evento. */
export const updateEvent = async ({ applicationId, eventId, body }: UpdateEventVariables) => {
  const { data } = await apiClient.patch<UpdateEventResponse>(
    `/applications/${applicationId}/events/${eventId}`,
    body,
  );
  return data;
};
