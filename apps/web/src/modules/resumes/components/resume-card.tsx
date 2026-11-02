import { FileText } from "lucide-react";
import { formatDate } from "../../../common/utils/date";
import { getResumeFileUrl } from "../http/get-resume-file-url.http";
import type { ListResumesResponse } from "../http/list-resumes.http";

type ResumeCardProps = {
  resume: ListResumesResponse[number];
};

/**
 * Card de um currículo (ui.md, Tela 4): nome, descrição, o PDF (abre em nova aba), a data de
 * atualização e em quantas candidaturas foi usado.
 */
export function ResumeCard({ resume }: ResumeCardProps) {
  const count = resume.applications_count;

  return (
    <article className="gap-xs border-border bg-surface p-md flex flex-col rounded-lg border">
      <p className="px-xs font-medium">{resume.name}</p>
      {resume.description && <p className="px-xs text-text-secondary">{resume.description}</p>}
      <a
        href={getResumeFileUrl(resume.id)}
        target="_blank"
        rel="noopener"
        className="gap-xxs px-xs text-primary-text inline-flex items-center font-medium [overflow-wrap:anywhere] hover:underline"
      >
        <FileText className="size-4 shrink-0" aria-hidden />
        {resume.file_name}
      </a>
      <p className="px-xs text-caption text-text-muted">
        Atualizado em {formatDate(resume.updated_at)}
      </p>
      <div className="border-border pt-xs mt-auto flex items-center justify-between border-t">
        <span className="px-xs text-text-secondary">
          Usado em {count} {count === 1 ? "candidatura" : "candidaturas"}
        </span>
      </div>
    </article>
  );
}
