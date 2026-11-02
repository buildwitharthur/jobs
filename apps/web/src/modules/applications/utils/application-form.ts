import { todayInput } from "../../../common/utils/date";
import type { CreateApplicationBody } from "../http/create-application.http";
import type { GetApplicationResponse } from "../http/get-application.http";
import type { CreateApplicationFormValues } from "../schemas/create-application.schema";
import type { UpdateApplicationFormValues } from "../schemas/update-application.schema";

export const applicationFormDefaults = (): CreateApplicationFormValues => ({
  company: "",
  role: "",
  job_url: "",
  source: "",
  applied_at: todayInput(),
  status: "applied",
  resume_id: "",
  salary: "",
  work_model: "",
  location: "",
  contacts: "",
  notes: "",
});

/** Valores do formulário a partir de uma candidatura vinda da API (null vira texto vazio). */
export const toUpdateFormValues = (
  application: GetApplicationResponse,
): UpdateApplicationFormValues => ({
  company: application.company,
  role: application.role,
  job_url: application.job_url ?? "",
  source: application.source ?? "",
  applied_at: application.applied_at,
  resume_id: application.resume ? String(application.resume.id) : "",
  salary: application.salary ?? "",
  work_model: application.work_model ?? "",
  location: application.location ?? "",
  contacts: application.contacts ?? "",
  notes: application.notes ?? "",
});

/** Corpo da requisição a partir dos valores do formulário (texto vazio vira null). */
export const toApplicationBody = (
  values: UpdateApplicationFormValues & { status?: string },
): CreateApplicationBody => ({
  company: values.company.trim(),
  role: values.role.trim(),
  job_url: values.job_url.trim() || null,
  source: values.source.trim() || null,
  applied_at: values.applied_at || undefined,
  status: (values.status || undefined) as CreateApplicationBody["status"],
  resume_id: values.resume_id ? Number(values.resume_id) : null,
  salary: values.salary.trim() || null,
  work_model: values.work_model || null,
  location: values.location.trim() || null,
  contacts: values.contacts.trim() || null,
  notes: values.notes.trim() || null,
});
