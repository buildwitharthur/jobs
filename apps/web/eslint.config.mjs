import base from "../../eslint.config.mjs";

export default [
  // Arquivos gerados (TanStack Router e openapi-typescript); não passam pelo lint.
  { ignores: ["src/routeTree.gen.ts", "src/common/lib/api-schema.d.ts"] },
  ...base,
];
