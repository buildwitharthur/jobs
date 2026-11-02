import axios from "axios";

/**
 * Cliente HTTP da API. Os tipos das rotas (`paths`) vêm de `api-schema.d.ts`, gerado do
 * `openapi.json` da API (ver `pnpm generate:api`).
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
});

// Rejeita os erros da API para eles caírem no `onError` das mutations (e no `error` das queries).
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
