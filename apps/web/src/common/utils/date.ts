/** Data de hoje no formato do `<input type="date">` ("2026-11-02"), no horário local. */
export const todayInput = () => new Date().toLocaleDateString("sv");

/** ISO 8601 para o valor do `<input type="datetime-local">` ("2026-11-05T10:00"), no horário local. */
export const toDateTimeLocal = (iso: string) => {
  const date = new Date(iso);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
