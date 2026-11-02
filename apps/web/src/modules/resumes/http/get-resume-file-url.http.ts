import { apiClient } from "../../../common/lib/api-client";

/**
 * Endereço do PDF do currículo (GET /resumes/:id/file), para abrir em nova aba ou baixar.
 * Não faz chamada: o navegador é quem abre o endereço, por isso só monta a URL com a baseURL do apiClient.
 */
export const getResumeFileUrl = (id: number) => `${apiClient.defaults.baseURL}/resumes/${id}/file`;
