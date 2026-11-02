export interface ResumeFileRepository {
  /** Grava o arquivo com um nome único e retorna o identificador interno dele. */
  save(content: Buffer): Promise<string>;
  /** Apaga o arquivo. Não falha se ele não existir. */
  delete(storedName: string): Promise<void>;
  exists(storedName: string): Promise<boolean>;
  /** Caminho completo do arquivo no disco. */
  locate(storedName: string): string;
}
