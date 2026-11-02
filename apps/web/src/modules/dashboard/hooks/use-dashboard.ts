import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../http/get-dashboard.http";

export const dashboardQueryKey = () => ["dashboard"] as const;

/** Resumo geral: totais, contagem por status e eventos recentes. */
export const useDashboard = () =>
  useQuery({
    queryKey: dashboardQueryKey(),
    queryFn: getDashboard,
  });
