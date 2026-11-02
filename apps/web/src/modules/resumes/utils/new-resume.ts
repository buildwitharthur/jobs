// Id do currículo recém-cadastrado a partir de um PDF. O card dele lê e limpa este valor ao
// aparecer, para focar o nome (o nome vem do arquivo e a pessoa costuma querer ajustá-lo).
let newResumeId: number | null = null;

export const markNewResume = (id: number) => {
  newResumeId = id;
};

/** `true` uma única vez, para o currículo marcado. */
export const consumeNewResume = (id: number) => {
  if (newResumeId !== id) return false;
  newResumeId = null;
  return true;
};
