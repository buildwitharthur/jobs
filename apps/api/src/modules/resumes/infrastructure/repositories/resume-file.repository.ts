import { randomUUID } from "node:crypto";
import { access, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ResumeFileRepository } from "../../domain/repositories/resume-file.repository.js";

// Pasta dentro do projeto, relativa a `apps/api` (de onde a API é iniciada).
const RESUMES_DIR = path.resolve(process.cwd(), "storage", "resumes");

export class ResumeFileRepositoryImpl implements ResumeFileRepository {
  async save(content: Buffer): Promise<string> {
    const storedName = `${randomUUID()}.pdf`;

    await mkdir(RESUMES_DIR, { recursive: true });
    await writeFile(this.locate(storedName), content);

    return storedName;
  }

  async delete(storedName: string): Promise<void> {
    await rm(this.locate(storedName), { force: true });
  }

  async exists(storedName: string): Promise<boolean> {
    try {
      await access(this.locate(storedName));
      return true;
    } catch {
      return false;
    }
  }

  locate(storedName: string): string {
    return path.join(RESUMES_DIR, path.basename(storedName));
  }
}
