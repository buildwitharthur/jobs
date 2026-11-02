import {
  extendZodWithOpenApi,
  OpenApiGeneratorV31,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

/**
 * Gera o documento OpenAPI. Deve ser chamado só depois de todos os controllers terem sido
 * importados, porque o `registry.registerPath` de cada rota roda no import.
 */
export const generateOpenApiDocument = () =>
  new OpenApiGeneratorV31(registry.definitions).generateDocument({
    openapi: "3.1.0",
    info: {
      title: "Controle de Candidaturas API",
      version: "1.0.0",
    },
    servers: [{ url: "/" }],
  });
