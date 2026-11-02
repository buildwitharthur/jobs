export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  /** Mensagem de cada campo que falhou (campo → mensagem). Usado em erros de validação. */
  public readonly details?: Record<string, string>;

  constructor(
    message: string,
    statusCode = 400,
    code = "bad_request",
    details?: Record<string, string>,
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}
