import { apiClient } from "../../../common/lib/api-client";
import type { paths } from "../../../common/lib/api-schema";

type Operation = paths["/board"]["get"];

export type GetBoardQuery = NonNullable<Operation["parameters"]["query"]>;
export type GetBoardResponse = Operation["responses"][200]["content"]["application/json"];

/** GET /board: candidaturas agrupadas por status, uma coluna por status. */
export const getBoard = async (query?: GetBoardQuery) => {
  const { data } = await apiClient.get<GetBoardResponse>("/board", { params: query });
  return data;
};
