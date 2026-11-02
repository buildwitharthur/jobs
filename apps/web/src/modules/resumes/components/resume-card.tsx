import { useEffect, useState, type DragEvent, type KeyboardEvent } from "react";
import { ChevronRight, FileText, Trash2, TriangleAlert } from "lucide-react";
import { DeleteAlert } from "../../../common/components/ui/alert-dialog";
import { Button } from "../../../common/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../common/components/ui/collapsible";
import { Input } from "../../../common/components/ui/input";
import { Textarea } from "../../../common/components/ui/textarea";
import { Tooltip } from "../../../common/components/ui/tooltip";
import { cn } from "../../../common/utils/cn";
import { formatDate } from "../../../common/utils/date";
import { plural } from "../../../common/utils/plural";
import { useDeleteResume } from "../hooks/use-delete-resume";
import { useReplaceResumeFile } from "../hooks/use-replace-resume-file";
import { useUpdateResumeForm } from "../hooks/use-update-resume-form";
import { getResumeFileUrl } from "../http/get-resume-file-url.http";
import type { ListResumesResponse } from "../http/list-resumes.http";
import type { UpdateResumeFormValues } from "../schemas/update-resume.schema";
import { isFileDrag } from "../utils/file-drag";
import { consumeNewResume } from "../utils/new-resume";
import { ResumeApplications } from "./resume-applications";

type ResumeCardProps = {
  resume: ListResumesResponse[number];
};

/**
 * Card de um currículo (ui.md, Tela 4): nome e descrição editáveis no lugar, o PDF (abre em nova
 * aba; soltar outro PDF sobre o card troca o arquivo), a data de atualização, a lista "usado em" e
 * a exclusão.
 */
export function ResumeCard({ resume }: ResumeCardProps) {
  const {
    register,
    saveField,
    setFocus,
    formState: { errors },
  } = useUpdateResumeForm(resume);
  const { mutate: replaceFile } = useReplaceResumeFile();
  const { mutate: deleteResume, isPending: isDeleting } = useDeleteResume();

  // PDF solto sobre o card, esperando a confirmação da troca.
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Currículo recém-cadastrado por um PDF: já abre com o nome focado.
  useEffect(() => {
    if (consumeNewResume(resume.id)) setFocus("name");
  }, [resume.id, setFocus]);

  /** Campo de texto que salva ao sair dele; `Enter` também sai (na descrição, `Ctrl+Enter`). */
  const field = (name: keyof UpdateResumeFormValues) => ({
    ...register(name, { onBlur: () => saveField(name) }),
    "aria-invalid": !!errors[name],
    onKeyDown: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const multiline = event.currentTarget instanceof HTMLTextAreaElement;
      if (event.key === "Enter" && (!multiline || event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        event.currentTarget.blur();
      }
    },
  });

  const handleDragOver = (event: DragEvent) => {
    if (!isFileDrag(event.nativeEvent)) return;
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: DragEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragOver(false);
  };

  // O card trata o próprio drop: sem propagar, a tela não cadastra um currículo novo.
  const handleDrop = (event: DragEvent) => {
    if (!isFileDrag(event.nativeEvent)) return;
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) setPendingFile(file);
  };

  const confirmReplace = () => {
    if (!pendingFile) return;
    replaceFile({ id: resume.id, file: pendingFile });
    setPendingFile(null);
  };

  const count = resume.applications_count;
  const usage = plural(count, "candidatura", "candidaturas");

  return (
    <article
      data-resume={resume.id}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "gap-xs border-border bg-surface p-md flex flex-col rounded-lg border transition-colors",
        // Com um PDF por cima (design.md: dropzone-active).
        (isDragOver || pendingFile) &&
          "border-primary bg-primary-subtle ring-primary border-dashed ring-1",
      )}
    >
      <Input
        variant="inline"
        className="font-medium"
        placeholder="Ex.: Backend Sênior"
        aria-label="Nome do currículo"
        {...field("name")}
      />
      {errors.name && <p className="px-xs text-caption text-danger-text">{errors.name.message}</p>}
      <Textarea
        variant="inline"
        rows={2}
        className="text-text-secondary min-h-14"
        placeholder="Adicionar descrição ou foco"
        aria-label="Descrição"
        {...field("description")}
      />
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

      {pendingFile && (
        <div className="gap-xs bg-warning-bg p-xs text-warning-text flex flex-wrap items-center rounded-md">
          <TriangleAlert className="size-4 shrink-0" aria-hidden />
          <span>
            Trocar o PDF por <strong>{pendingFile.name}</strong>? O arquivo atual será apagado.
          </span>
          <Button variant="danger-confirm" onClick={confirmReplace}>
            Trocar arquivo
          </Button>
          <Button variant="ghost" onClick={() => setPendingFile(null)}>
            Cancelar
          </Button>
        </div>
      )}

      <Collapsible className="gap-xs mt-auto flex flex-col">
        <CollapsibleContent>
          <ResumeApplications resumeId={resume.id} />
        </CollapsibleContent>
        <div className="border-border pt-xs gap-xs flex flex-wrap items-center justify-between border-t">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="group">
              <ChevronRight
                className="transition-transform group-data-[state=open]:rotate-90"
                aria-hidden
              />
              Usado em {usage}
            </Button>
          </CollapsibleTrigger>
          {count > 0 ? (
            <Tooltip content={`Em uso por ${usage}`}>
              <span className="ml-auto">
                <Button variant="danger" disabled>
                  <Trash2 aria-hidden />
                  Excluir
                </Button>
              </span>
            </Tooltip>
          ) : (
            <DeleteAlert
              title="Excluir currículo?"
              description={
                <>
                  <strong>{resume.name}</strong> e o arquivo PDF serão apagados. Não dá para
                  desfazer.
                </>
              }
              onConfirm={() => deleteResume(resume.id)}
            >
              <Button variant="danger" className="ml-auto" disabled={isDeleting}>
                <Trash2 aria-hidden />
                Excluir
              </Button>
            </DeleteAlert>
          )}
        </div>
      </Collapsible>
    </article>
  );
}
