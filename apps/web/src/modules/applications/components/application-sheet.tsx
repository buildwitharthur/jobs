import type { KeyboardEvent, ReactNode } from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import { Controller } from "react-hook-form";
import { DeleteAlert } from "../../../common/components/ui/alert-dialog";
import { StatusDot } from "../../../common/components/ui/badge";
import { Button } from "../../../common/components/ui/button";
import { Input } from "../../../common/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../common/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../../../common/components/ui/sheet";
import { Textarea } from "../../../common/components/ui/textarea";
import { useResumes } from "../../resumes/hooks/use-resumes";
import { getResumeFileUrl } from "../../resumes/http/get-resume-file-url.http";
import { useApplication } from "../hooks/use-application";
import { useChangeApplicationStatus } from "../hooks/use-change-application-status";
import { useDeleteApplication } from "../hooks/use-delete-application";
import { useStatuses } from "../hooks/use-statuses";
import { useUpdateApplicationForm } from "../hooks/use-update-application-form";
import type { GetApplicationResponse } from "../http/get-application.http";
import type { UpdateApplicationField } from "../schemas/update-application.schema";
import type { BoardCard, Status } from "../utils/board";
import { WORK_MODELS } from "../utils/work-models";
import { ApplicationHistory } from "./application-history";

type ApplicationSheetProps = {
  /**
   * A candidatura que o painel mostra: o card do kanban ou um item da lista "usado em" de um
   * currículo. O painel só precisa do `id` (busca o resto) e de empresa e cargo para o título.
   */
  card: Pick<BoardCard, "id" | "company" | "role">;
  /** O que abre o painel (ex.: o próprio card). */
  children: ReactNode;
};

/**
 * Painel lateral com o detalhe da candidatura (ui.md, Tela 2). Abre e fecha sozinho, sem estado de
 * fora; o detalhe só é buscado quando o painel abre.
 */
export function ApplicationSheet({ card, children }: ApplicationSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        aria-describedby={undefined}
        // Na edição de um evento, o `Esc` cancela a edição e não fecha o painel.
        onEscapeKeyDown={(event) => {
          if (event.target instanceof Element && event.target.closest("[data-event-edit]")) {
            event.preventDefault();
          }
        }}
      >
        <VisuallyHidden.Root>
          <SheetTitle>
            {card.company}, {card.role}
          </SheetTitle>
        </VisuallyHidden.Root>
        <ApplicationDetail id={card.id} />
      </SheetContent>
    </Sheet>
  );
}

function ApplicationDetail({ id }: { id: number }) {
  const { data: application } = useApplication(id);

  if (!application) {
    return (
      <div className="gap-xs px-xl pt-lg pb-md flex flex-col" aria-hidden>
        <span className="bg-surface-sunken block h-7 w-48 rounded-sm" />
        <span className="bg-surface-sunken block h-5 w-64 rounded-sm" />
      </div>
    );
  }

  return <ApplicationForm application={application} />;
}

function ApplicationForm({ application }: { application: GetApplicationResponse }) {
  const {
    register,
    control,
    saveField,
    formState: { errors },
  } = useUpdateApplicationForm(application);
  const { data: statuses = [] } = useStatuses();
  const { data: resumes = [] } = useResumes();
  const { mutate: changeStatus } = useChangeApplicationStatus();
  const { mutate: deleteApplication } = useDeleteApplication();

  /** Campo de texto que salva ao sair dele; `Enter` também sai (nos textos longos, `Ctrl+Enter`). */
  const field = (name: UpdateApplicationField) => ({
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

  return (
    <>
      <div
        data-status={application.status}
        className="gap-xs border-border px-xl pt-lg pb-md flex flex-col border-b pr-16"
      >
        <div>
          <Input
            variant="inline"
            className="text-title"
            placeholder="Ex.: Acme Tecnologia"
            aria-label="Empresa"
            {...field("company")}
          />
          <FieldError message={errors.company?.message} />
          <Input
            variant="inline"
            className="text-text-secondary"
            placeholder="Ex.: Desenvolvedora Backend Sênior"
            aria-label="Cargo"
            {...field("role")}
          />
          <FieldError message={errors.role?.message} />
        </div>
        <div className="px-xs">
          <Select
            value={application.status}
            onValueChange={(status) =>
              changeStatus({ id: application.id, body: { status: status as Status } })
            }
          >
            <SelectTrigger
              aria-label="Status"
              className="h-control-sm bg-status-bg px-xs text-status-text w-auto rounded-sm border-transparent font-medium [&_svg]:text-current"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <span className="gap-xs inline-flex items-center">
                    <StatusDot status={status.value} />
                    {status.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="px-xl pt-md pb-xl flex-1 overflow-y-auto">
        <h3 className="text-heading mb-xs">Dados</h3>
        <div className="gap-x-xs grid grid-cols-[140px_1fr] items-start gap-y-0.5">
          <Prop label="Link da vaga" error={errors.job_url?.message}>
            <Input
              variant="inline"
              type="url"
              placeholder="Colar o link da vaga"
              aria-label="Link da vaga"
              {...field("job_url")}
            />
            {application.job_url && (
              <Button variant="ghost" size="icon" asChild>
                <a
                  href={application.job_url}
                  target="_blank"
                  rel="noopener"
                  title="Abrir a vaga"
                  aria-label="Abrir a vaga"
                >
                  <ExternalLink aria-hidden />
                </a>
              </Button>
            )}
          </Prop>
          <Prop label="Onde se candidatou" error={errors.source?.message}>
            <Input
              variant="inline"
              placeholder="Ex.: LinkedIn, site da empresa, indicação"
              aria-label="Onde se candidatou"
              {...field("source")}
            />
          </Prop>
          <Prop label="Data" error={errors.applied_at?.message}>
            <Input
              variant="inline"
              type="date"
              aria-label="Data"
              aria-invalid={!!errors.applied_at}
              {...register("applied_at", { onChange: () => saveField("applied_at") })}
            />
          </Prop>
          <Prop label="Currículo" error={errors.resume_id?.message}>
            <Controller
              control={control}
              name="resume_id"
              render={({ field: { value, onChange } }) => (
                <Select
                  value={value}
                  onValueChange={(resumeId) => {
                    onChange(resumeId);
                    void saveField("resume_id");
                  }}
                >
                  <SelectTrigger aria-label="Currículo" className={INLINE_SELECT}>
                    <SelectValue placeholder="Selecione o currículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes.map((resume) => (
                      <SelectItem key={resume.id} value={String(resume.id)}>
                        {resume.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {application.resume && (
              <Button variant="ghost" size="icon" asChild>
                <a
                  href={getResumeFileUrl(application.resume.id)}
                  target="_blank"
                  rel="noopener"
                  title="Abrir o PDF"
                  aria-label="Abrir o PDF"
                >
                  <ExternalLink aria-hidden />
                </a>
              </Button>
            )}
          </Prop>
          <Prop label="Salário" error={errors.salary?.message}>
            <Input
              variant="inline"
              placeholder="Adicionar faixa ou pretensão"
              aria-label="Salário"
              {...field("salary")}
            />
          </Prop>
          <Prop label="Modelo" error={errors.work_model?.message}>
            <Controller
              control={control}
              name="work_model"
              render={({ field: { value, onChange } }) => (
                <Select
                  value={value}
                  onValueChange={(workModel) => {
                    onChange(workModel);
                    void saveField("work_model");
                  }}
                >
                  <SelectTrigger aria-label="Modelo" className={INLINE_SELECT}>
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_MODELS.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Prop>
          <Prop label="Localização" error={errors.location?.message}>
            <Input
              variant="inline"
              placeholder="Adicionar localização"
              aria-label="Localização"
              {...field("location")}
            />
          </Prop>
          <Prop label="Contatos" error={errors.contacts?.message}>
            <Textarea
              variant="inline"
              rows={2}
              placeholder="Adicionar nome, e-mail ou telefone do recrutador"
              aria-label="Contatos"
              {...field("contacts")}
            />
          </Prop>
          <Prop label="Anotações" error={errors.notes?.message}>
            <Textarea
              variant="inline"
              rows={2}
              placeholder="Adicionar anotações"
              aria-label="Anotações"
              {...field("notes")}
            />
          </Prop>
        </div>

        <ApplicationHistory application={application} />
      </div>

      <div className="border-border px-xl py-sm flex justify-end border-t">
        <DeleteAlert
          title="Excluir candidatura?"
          description={
            <>
              A candidatura em <strong>{application.company}</strong> e todo o histórico dela serão
              apagados. O currículo vinculado não é excluído. Não dá para desfazer.
            </>
          }
          onConfirm={() => deleteApplication(application.id)}
        >
          <Button variant="danger">
            <Trash2 aria-hidden />
            Excluir candidatura
          </Button>
        </DeleteAlert>
      </div>
    </>
  );
}

// Seletor com o visual de campo editado no lugar: parece texto até receber foco.
const INLINE_SELECT =
  "h-auto min-h-control-sm rounded-sm border-transparent bg-transparent px-xs py-xxs hover:bg-surface-sunken";

/** Uma linha dos dados: rótulo à esquerda, campo (e erro) à direita. */
function Prop({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <>
      <span className="min-h-control-sm text-label text-text-secondary flex items-center">
        {label}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="gap-xxs flex items-center">{children}</span>
        <FieldError message={error} />
      </span>
    </>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <span className="text-caption text-danger-text">{message}</span> : null;
}
