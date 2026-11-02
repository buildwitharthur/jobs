import { StatusBadge } from "../../../common/components/ui/badge";
import { ApplicationSheet } from "../../applications/components/application-sheet";
import { useStatuses } from "../../applications/hooks/use-statuses";
import { useResumeApplications } from "../hooks/use-resume-applications";

/**
 * Candidaturas que usaram o currículo (ui.md, Tela 4). Só é montada quando "usado em" expande, e
 * é então que a lista é buscada. Clicar numa candidatura abre o painel de detalhe.
 */
export function ResumeApplications({ resumeId }: { resumeId: number }) {
  const { data: applications } = useResumeApplications(resumeId);
  const { data: statuses = [] } = useStatuses();

  if (!applications) return null;

  return (
    <div className="bg-bg p-xs flex flex-col gap-0.5 rounded-md">
      {applications.length === 0 ? (
        <p className="px-xs py-xxs text-text-secondary">
          Ainda não foi usado em nenhuma candidatura.
        </p>
      ) : (
        applications.map((application) => (
          <ApplicationSheet key={application.id} card={application}>
            <button
              type="button"
              className="gap-xs px-xs py-xxs hover:bg-surface-sunken flex cursor-pointer items-center justify-between rounded-sm text-left"
            >
              <span>
                {application.company}{" "}
                <span className="text-text-secondary">· {application.role}</span>
              </span>
              <StatusBadge status={application.status}>
                {statuses.find((status) => status.value === application.status)?.label}
              </StatusBadge>
            </button>
          </ApplicationSheet>
        ))
      )}
    </div>
  );
}
