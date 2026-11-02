import type { Prisma } from "../../../../../common/infrastructure/database/prisma/generated/client.js";
import { prisma } from "../../../../../common/infrastructure/database/prisma/index.js";
import type { Status } from "../../../../statuses/domain/models/status.model.js";
import type { Application } from "../../../domain/models/application.model.js";
import type {
  ApplicationChanges,
  ApplicationData,
  ApplicationFilters,
  ApplicationRepository,
  ApplicationSort,
  StatusChangeResult,
} from "../../../domain/repositories/application.repository.js";
import type { NewApplicationEvent } from "../../../../events/domain/models/event.model.js";

const DEFAULT_SORT: ApplicationSort = "-applied_at";

const buildWhere = (filters: ApplicationFilters): Prisma.ApplicationWhereInput => {
  const { status, q, from, to, resume_id } = filters;

  return {
    ...(status && status.length > 0 ? { status: { in: status } } : {}),
    ...(q
      ? {
          OR: [
            { company: { contains: q, mode: "insensitive" } },
            { role: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(from || to
      ? { applied_at: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } }
      : {}),
    ...(resume_id !== undefined ? { resume_id } : {}),
  };
};

const buildOrderBy = (sort: ApplicationSort): Prisma.ApplicationOrderByWithRelationInput[] => {
  const direction = sort.startsWith("-") ? "desc" : "asc";
  const field = sort.replace(/^-/, "") as "applied_at" | "updated_at" | "company";

  // `id` desempata para a ordem ficar estável.
  return [{ [field]: direction }, { id: direction }];
};

export class ApplicationPrismaRepository implements ApplicationRepository {
  async create(data: ApplicationData, event: NewApplicationEvent): Promise<Application> {
    return prisma.application.create({
      data: { ...data, events: { create: event } },
    });
  }

  async findAll(filters: ApplicationFilters): Promise<Application[]> {
    return prisma.application.findMany({
      where: buildWhere(filters),
      orderBy: buildOrderBy(filters.sort ?? DEFAULT_SORT),
    });
  }

  async findById(id: number): Promise<Application | null> {
    return prisma.application.findUnique({ where: { id } });
  }

  async update(id: number, changes: ApplicationChanges): Promise<Application> {
    return prisma.application.update({ where: { id }, data: changes });
  }

  async changeStatus(
    id: number,
    status: Status,
    event: NewApplicationEvent,
  ): Promise<StatusChangeResult> {
    return prisma.$transaction(async (tx) => {
      const application = await tx.application.update({ where: { id }, data: { status } });
      const createdEvent = await tx.applicationEvent.create({
        data: { ...event, application_id: id },
      });

      return { application, event: createdEvent };
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.application.delete({ where: { id } });
  }

  async countByStatus(): Promise<Partial<Record<Status, number>>> {
    const groups = await prisma.application.groupBy({ by: ["status"], _count: { _all: true } });

    return Object.fromEntries(groups.map((group) => [group.status, group._count._all]));
  }

  async countAppliedSince(date: Date): Promise<number> {
    return prisma.application.count({ where: { applied_at: { gte: date } } });
  }
}
