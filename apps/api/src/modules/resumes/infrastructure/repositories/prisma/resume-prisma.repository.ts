import { prisma } from "../../../../../common/infrastructure/database/prisma/index.js";
import type { ResumeWithUsage } from "../../../domain/models/resume.model.js";
import type {
  ResumeData,
  ResumeRepository,
} from "../../../domain/repositories/resume.repository.js";

const withUsage = { _count: { select: { applications: true } } } as const;

const toResume = ({
  _count,
  ...resume
}: Omit<ResumeWithUsage, "applications_count"> & {
  _count: { applications: number };
}): ResumeWithUsage => ({ ...resume, applications_count: _count.applications });

export class ResumePrismaRepository implements ResumeRepository {
  async findAll(): Promise<ResumeWithUsage[]> {
    const resumes = await prisma.resume.findMany({
      include: withUsage,
      orderBy: [{ updated_at: "desc" }, { id: "desc" }],
    });

    return resumes.map(toResume);
  }

  async findById(id: number): Promise<ResumeWithUsage | null> {
    const resume = await prisma.resume.findUnique({ where: { id }, include: withUsage });

    return resume ? toResume(resume) : null;
  }

  async create(data: ResumeData): Promise<ResumeWithUsage> {
    return toResume(await prisma.resume.create({ data, include: withUsage }));
  }

  async update(id: number, changes: Partial<ResumeData>): Promise<ResumeWithUsage> {
    return toResume(
      await prisma.resume.update({ where: { id }, data: changes, include: withUsage }),
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.resume.delete({ where: { id } });
  }
}
