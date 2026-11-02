import { useQuery } from "@tanstack/react-query";
import { listResumes } from "../http/list-resumes.http";

export const resumesQueryKey = () => ["resumes", "list"] as const;

/** Currículos, do mais recente para o mais antigo. */
export const useResumes = () =>
  useQuery({
    queryKey: resumesQueryKey(),
    queryFn: listResumes,
  });
