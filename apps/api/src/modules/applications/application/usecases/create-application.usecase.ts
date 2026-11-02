import { AppError } from "../../../../common/domain/errors/app-error.js";
import { todayUtc } from "../../../../common/domain/date.js";
import type { ResumeRepository } from "../../../resumes/domain/repositories/resume.repository.js";
import type { Status } from "../../../statuses/domain/models/status.model.js";
import type { Application, WorkModel } from "../../domain/models/application.model.js";
import type { ApplicationRepository } from "../../domain/repositories/application.repository.js";

export type CreateApplicationInput = {
  company: string;
  role: string;
  job_url?: string | null;
  source?: string | null;
  applied_at?: Date;
  status?: Status;
  resume_id?: number | null;
  salary?: string | null;
  work_model?: WorkModel | null;
  location?: string | null;
  contacts?: string | null;
  notes?: string | null;
};
export type CreateApplicationOutput = Application;

export class CreateApplicationUseCase {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly resumeRepository: ResumeRepository,
  ) {}

  async execute(input: CreateApplicationInput): Promise<CreateApplicationOutput> {
    const company = input.company.trim();
    const role = input.role.trim();

    if (!company || !role) {
      throw new AppError("Empresa e cargo são obrigatórios.", 400, "validation_error");
    }

    const resumeId = input.resume_id ?? null;

    if (resumeId !== null && !(await this.resumeRepository.findById(resumeId))) {
      throw new AppError("Currículo não encontrado.", 400, "validation_error");
    }

    const status = input.status ?? "applied";

    return this.applicationRepository.create(
      {
        company,
        role,
        job_url: input.job_url ?? null,
        source: input.source ?? null,
        applied_at: input.applied_at ?? todayUtc(),
        status,
        resume_id: resumeId,
        salary: input.salary ?? null,
        work_model: input.work_model ?? null,
        location: input.location ?? null,
        contacts: input.contacts ?? null,
        notes: input.notes ?? null,
      },
      {
        type: "created",
        from_status: null,
        to_status: status,
        note: null,
        occurred_at: new Date(),
      },
    );
  }
}
