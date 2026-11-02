import { useQuery } from "@tanstack/react-query";
import { getApplication } from "../http/get-application.http";

export const applicationQueryKey = (id: number | undefined) =>
  ["applications", "detail", id] as const;

/** Detalhe de uma candidatura (com currículo e histórico). Só busca quando há um `id`. */
export const useApplication = (id: number | undefined) =>
  useQuery({
    queryKey: applicationQueryKey(id),
    queryFn: () => getApplication(id!),
    enabled: id !== undefined,
  });
