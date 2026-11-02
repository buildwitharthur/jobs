import { z } from "zod";
import { AppError } from "../../../domain/errors/app-error.js";

// Mensagens de validação do Zod em português.
z.config(z.locales.pt());

const ROOT_FIELD = "_";

/**
 * Valida `content` com o `schema` do Zod.
 *
 * - Dados válidos: retorna os dados já formatados pelo schema (trim, coerções, valores padrão).
 * - Dados inválidos: lança `AppError` 400 `validation_error`, com `details` indicando a mensagem
 *   de cada campo que falhou (ex.: `{ "body.company": "..." }`).
 */
export const dataValidation = <TSchema extends z.ZodType>(
  schema: TSchema,
  content: unknown,
): z.output<TSchema> => {
  const result = schema.safeParse(content);

  if (result.success) {
    return result.data;
  }

  const details: Record<string, string> = {};

  for (const issue of result.error.issues) {
    const field = issue.path.join(".") || ROOT_FIELD;

    // Se o mesmo campo tiver mais de um erro, fica o primeiro.
    details[field] ??= issue.message;
  }

  throw new AppError("Dados inválidos.", 400, "validation_error", details);
};
