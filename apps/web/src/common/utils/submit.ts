import type { BaseSyntheticEvent } from "react";
import type { FieldValues, SubmitHandler, UseFormHandleSubmit } from "react-hook-form";

/**
 * Monta o `submit` de um formulário. Quando o `onValid` falha (a mutation rejeitou), o
 * `handleSubmit` do React Hook Form marca o formulário como não enviado e repassa o erro. Esse erro
 * já foi tratado no `onError` da mutation (aviso e campos), então aqui ele é engolido para não
 * virar um "Uncaught (in promise)".
 */
export const createSubmit =
  <TFieldValues extends FieldValues>(
    handleSubmit: UseFormHandleSubmit<TFieldValues>,
    onValid: SubmitHandler<TFieldValues>,
  ) =>
  async (event?: BaseSyntheticEvent) => {
    try {
      await handleSubmit(onValid)(event);
    } catch {
      // Já tratado no onError da mutation.
    }
  };
