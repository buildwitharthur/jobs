import { prisma } from "../../../../../common/infrastructure/database/prisma/index.js";
import type {
  ApplicationEvent,
  NewApplicationEvent,
  RecentEvent,
} from "../../../domain/models/event.model.js";
import type { EventRepository } from "../../../domain/repositories/event.repository.js";

export class EventPrismaRepository implements EventRepository {
  async findAllByApplication(applicationId: number): Promise<ApplicationEvent[]> {
    return prisma.applicationEvent.findMany({
      where: { application_id: applicationId },
      orderBy: [{ occurred_at: "desc" }, { id: "desc" }],
    });
  }

  async findById(id: number): Promise<ApplicationEvent | null> {
    return prisma.applicationEvent.findUnique({ where: { id } });
  }

  async create(applicationId: number, data: NewApplicationEvent): Promise<ApplicationEvent> {
    return prisma.$transaction(async (tx) => {
      const event = await tx.applicationEvent.create({
        data: { ...data, application_id: applicationId },
      });
      await tx.application.update({
        where: { id: applicationId },
        data: { updated_at: new Date() },
      });

      return event;
    });
  }

  async update(
    id: number,
    changes: { note?: string | null; occurred_at?: Date },
  ): Promise<ApplicationEvent> {
    return prisma.applicationEvent.update({ where: { id }, data: changes });
  }

  async delete(id: number): Promise<void> {
    await prisma.applicationEvent.delete({ where: { id } });
  }

  async findLastOccurredAtByApplication(applicationIds: number[]): Promise<Map<number, Date>> {
    if (applicationIds.length === 0) {
      return new Map();
    }

    const groups = await prisma.applicationEvent.groupBy({
      by: ["application_id"],
      where: { application_id: { in: applicationIds } },
      _max: { occurred_at: true },
    });

    return new Map(
      groups.flatMap((group) =>
        group._max.occurred_at ? [[group.application_id, group._max.occurred_at] as const] : [],
      ),
    );
  }

  async findRecent(limit: number): Promise<RecentEvent[]> {
    const events = await prisma.applicationEvent.findMany({
      take: limit,
      orderBy: [{ occurred_at: "desc" }, { id: "desc" }],
      include: { application: { select: { company: true, role: true } } },
    });

    return events.map((event) => ({
      id: event.id,
      application_id: event.application_id,
      company: event.application.company,
      role: event.application.role,
      type: event.type,
      to_status: event.to_status,
      occurred_at: event.occurred_at,
    }));
  }
}
