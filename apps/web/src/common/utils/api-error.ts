import { isAxiosError } from "axios";
import { toast } from "sonner";

/** Corpo de erro da API (specs/api.md): `{ code, message, details? }`. */
export type ApiErrorBody = {
  code?: string;
  message?: string;
  details?: Record<string, string>;
};

const DEFAULT_ERROR_MESSAGE = "Algo deu errado, tente de novo.";

/** Mensagem do erro da API; sem resposta (ex.: sem conexão), a mensagem padrão. */
export const getApiErrorMessage = (error: unknown) =>
  (isAxiosError<ApiErrorBody>(error) ? error.response?.data?.message : undefined) ??
  DEFAULT_ERROR_MESSAGE;

/**
 * `onError` padrão das mutations: mostra o erro da API num aviso (toast). Os erros de validação dos
 * campos não passam por aqui: eles vêm do `formState` do formulário (schema do Zod).
 */
export const handleMutationError = (error: unknown) => {
  toast.error(getApiErrorMessage(error));
};
