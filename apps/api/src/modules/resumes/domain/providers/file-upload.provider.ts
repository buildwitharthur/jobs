import type { IncomingMessage } from "node:http";

export interface UploadedFile {
  content: Buffer;
  /** Nome original do arquivo enviado. */
  original_name: string;
}

export interface ParsedUpload {
  /** Campos de texto do formulário. */
  fields: Record<string, string>;
  /** Arquivo enviado no campo `file`, ou `null` se não veio nenhum. */
  file: UploadedFile | null;
}

export interface FileUploadProvider {
  /**
   * Lê uma requisição `multipart/form-data` e separa os campos de texto do arquivo.
   * Lança `AppError` 400 se o envio for inválido.
   */
  parse(request: IncomingMessage): Promise<ParsedUpload>;
}
