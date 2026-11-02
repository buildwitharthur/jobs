/** O arrasto traz arquivos (e não, por exemplo, um texto ou um card do kanban). */
export const isFileDrag = (event: { dataTransfer: DataTransfer | null }) =>
  Array.from(event.dataTransfer?.types ?? []).includes("Files");
