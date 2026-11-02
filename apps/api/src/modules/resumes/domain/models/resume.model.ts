export interface Resume {
  id: number;
  name: string;
  description: string | null;
  /** Nome original do arquivo enviado. */
  file_name: string;
  /** Identificador interno do arquivo no armazenamento. Nunca é exposto pela API. */
  file_path: string;
  created_at: Date;
  updated_at: Date;
}

export interface ResumeWithUsage extends Resume {
  applications_count: number;
}

/** Todo PDF começa com a assinatura `%PDF-`. */
export const isPdf = (content: Buffer): boolean =>
  content.subarray(0, 5).toString("latin1") === "%PDF-";
