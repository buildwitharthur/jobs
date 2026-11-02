import type { KeyboardEvent, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Controller } from "react-hook-form";
import { Button } from "../../../common/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../common/components/ui/collapsible";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../../../common/components/ui/dialog";
import { Input } from "../../../common/components/ui/input";
import { Label } from "../../../common/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../common/components/ui/select";
import { Textarea } from "../../../common/components/ui/textarea";
import { cn } from "../../../common/utils/cn";
import { useResumes } from "../../resumes/hooks/use-resumes";
import { useCreateApplicationForm } from "../hooks/use-create-application-form";
import { useStatuses } from "../hooks/use-statuses";
import { Kbd } from "./kbd";

const WORK_MODELS = [
  { value: "remote", label: "Remoto" },
  { value: "hybrid", label: "Híbrido" },
  { value: "onsite", label: "Presencial" },
] as const;

type CreateApplicationDialogProps = {
  /** O que abre o modal (ex.: o botão "Nova candidatura"). */
  children: ReactNode;
};

/** Modal "Nova candidatura" (ui.md, Tela 3). Abre e fecha sozinho, sem estado de fora. */
export function CreateApplicationDialog({ children }: CreateApplicationDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>Nova candidatura</DialogTitle>
        <CreateApplicationForm />
      </DialogContent>
    </Dialog>
  );
}

function CreateApplicationForm() {
  const {
    register,
    control,
    submit,
    isPending,
    formState: { errors },
  } = useCreateApplicationForm();
  const { data: statuses = [] } = useStatuses();
  const { data: resumes = [] } = useResumes();

  // Nos textos longos, Enter quebra a linha; Ctrl+Enter salva.
  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (
      event.key === "Enter" &&
      (event.ctrlKey || event.metaKey) &&
      event.target instanceof HTMLTextAreaElement
    ) {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <form onSubmit={submit} onKeyDown={handleKeyDown} noValidate className="gap-md flex flex-col">
      <div className="gap-sm grid grid-cols-2">
        <Field id="company" label="Empresa *" error={errors.company?.message}>
          <Input
            id="company"
            placeholder="Ex.: Acme Tecnologia"
            autoComplete="off"
            aria-invalid={!!errors.company}
            {...register("company")}
          />
        </Field>
        <Field id="role" label="Cargo *" error={errors.role?.message}>
          <Input
            id="role"
            placeholder="Ex.: Desenvolvedora Backend Sênior"
            autoComplete="off"
            aria-invalid={!!errors.role}
            {...register("role")}
          />
        </Field>
        <Field id="job_url" label="Link da vaga" error={errors.job_url?.message} full>
          <Input
            id="job_url"
            type="url"
            placeholder="https://..."
            aria-invalid={!!errors.job_url}
            {...register("job_url")}
          />
        </Field>
      </div>

      <Collapsible>
        <CollapsibleTrigger className="group gap-xxs text-primary-text inline-flex cursor-pointer items-center font-medium">
          <ChevronRight
            className="size-4 transition-transform group-data-[state=open]:rotate-90"
            aria-hidden
          />
          Mais detalhes
        </CollapsibleTrigger>
        <CollapsibleContent className="gap-sm mt-sm grid grid-cols-2">
          <Field id="source" label="Onde se candidatou" error={errors.source?.message}>
            <Input
              id="source"
              placeholder="Ex.: LinkedIn, site da empresa, indicação"
              aria-invalid={!!errors.source}
              {...register("source")}
            />
          </Field>
          <Field id="applied_at" label="Data" error={errors.applied_at?.message}>
            <Input
              id="applied_at"
              type="date"
              aria-invalid={!!errors.applied_at}
              {...register("applied_at")}
            />
          </Field>
          <Field id="status" label="Status" error={errors.status?.message}>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="status"
                    ref={field.ref}
                    onBlur={field.onBlur}
                    aria-invalid={!!errors.status}
                  >
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field id="resume_id" label="Currículo" error={errors.resume_id?.message}>
            <Controller
              control={control}
              name="resume_id"
              render={({ field }) => (
                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="resume_id"
                    ref={field.ref}
                    onBlur={field.onBlur}
                    aria-invalid={!!errors.resume_id}
                  >
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
          </Field>
          <Field id="salary" label="Salário" error={errors.salary?.message}>
            <Input
              id="salary"
              placeholder="Ex.: R$ 15.000 ou R$ 12–15 mil"
              aria-invalid={!!errors.salary}
              {...register("salary")}
            />
          </Field>
          <Field id="work_model" label="Modelo" error={errors.work_model?.message}>
            <Controller
              control={control}
              name="work_model"
              render={({ field }) => (
                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="work_model"
                    ref={field.ref}
                    onBlur={field.onBlur}
                    aria-invalid={!!errors.work_model}
                  >
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
          </Field>
          <Field id="location" label="Localização" error={errors.location?.message} full>
            <Input
              id="location"
              placeholder="Ex.: São Paulo, SP"
              aria-invalid={!!errors.location}
              {...register("location")}
            />
          </Field>
          <Field id="contacts" label="Contatos" error={errors.contacts?.message} full>
            <Textarea
              id="contacts"
              rows={2}
              placeholder="Nome, e-mail ou telefone do recrutador"
              aria-invalid={!!errors.contacts}
              {...register("contacts")}
            />
          </Field>
          <Field id="notes" label="Anotações" error={errors.notes?.message} full>
            <Textarea
              id="notes"
              rows={2}
              placeholder="Algo para lembrar sobre a vaga"
              aria-invalid={!!errors.notes}
              {...register("notes")}
            />
          </Field>
        </CollapsibleContent>
      </Collapsible>

      <DialogFooter>
        <span className="text-caption text-text-muted mr-auto">
          <Kbd>Enter</Kbd> salva · <Kbd>Esc</Kbd> fecha
        </span>
        <DialogClose asChild>
          <Button variant="secondary">Cancelar</Button>
        </DialogClose>
        <Button type="submit" disabled={isPending}>
          Salvar
        </Button>
      </DialogFooter>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  /** Ocupa as duas colunas da grade. */
  full?: boolean;
  children: ReactNode;
};

/** Rótulo, campo e a mensagem de erro embaixo (design.md: text-input-error). */
function Field({ id, label, error, full, children }: FieldProps) {
  return (
    <div className={cn("gap-xxs flex flex-col", full && "col-span-2")}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <span className="text-caption text-danger-text">{error}</span>}
    </div>
  );
}
