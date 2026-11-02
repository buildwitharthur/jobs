import { useQuery } from "@tanstack/react-query";
import { listApplications, type ListApplicationsQuery } from "../http/list-applications.http";

export const applicationsQueryKey = (query?: ListApplicationsQuery) =>
  ["applications", "list", query] as const;

/** Lista de candidaturas, com filtros, busca e ordenação. */
export const useApplications = (query?: ListApplicationsQuery) =>
  useQuery({
    queryKey: applicationsQueryKey(query),
    queryFn: () => listApplications(query),
  });
