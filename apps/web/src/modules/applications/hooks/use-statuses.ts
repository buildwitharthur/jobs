import { useQuery } from "@tanstack/react-query";
import { getStatuses } from "../http/get-statuses.http";

export const statusesQueryKey = () => ["statuses"] as const;

/** Lista fixa de status (rótulo e tipo), na ordem das colunas do kanban. */
export const useStatuses = () =>
  useQuery({
    queryKey: statusesQueryKey(),
    queryFn: getStatuses,
    // A lista é fixa no código da API: nunca fica desatualizada.
    staleTime: Infinity,
  });
