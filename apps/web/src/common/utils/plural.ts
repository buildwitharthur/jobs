/** "1 candidatura", "3 candidaturas". */
export const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;
