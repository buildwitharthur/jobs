import { useQuery } from "@tanstack/react-query";
import { listResumeApplications } from "../http/list-resume-applications.http";

export const resumeApplicationsQueryKey = (id: number | undefined) =>
  ["resumes", "applications", id] as const;

/** Candidaturas que usaram um currículo. Só busca quando há um `id`. */
export const useResumeApplications = (id: number | undefined) =>
  useQuery({
    queryKey: resumeApplicationsQueryKey(id),
    queryFn: () => listResumeApplications(id!),
    enabled: id !== undefined,
  });
