import { apiClient } from "../../../common/lib/api-client";
import type { paths } from "../../../common/lib/api-schema";

type Operation = paths["/resumes"]["post"];

// O OpenAPI descreve o arquivo como `string` (formato binary); aqui ele é um File de verdade.
type MultipartBody = Omit<
  NonNullable<Operation["requestBody"]>["content"]["multipart/form-data"],
  "file"
>;

export type CreateResumeBody = MultipartBody & { file: File };
export type CreateResumeResponse = Operation["responses"][201]["content"]["application/json"];

/** POST /resumes (multipart/form-data): cadastra um currículo a partir de um PDF. */
export const createResume = async ({ name, description, file }: CreateResumeBody) => {
  const form = new FormData();
  form.append("name", name);
  if (description) form.append("description", description);
  form.append("file", file);

  const { data } = await apiClient.post<CreateResumeResponse>("/resumes", form);
  return data;
};
