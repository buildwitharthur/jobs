/** Data de hoje no formato do `<input type="date">` ("2026-11-02"), no horário local. */
export const todayInput = () => new Date().toLocaleDateString("sv");

const DAY = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Há quanto tempo: "hoje", "ontem", "há 3 dias", "há 2 semanas", "há 3 meses". */
export const relativeTime = (iso: string) => {
  const days = Math.round(
    (startOfDay(new Date()).getTime() - startOfDay(new Date(iso)).getTime()) / DAY,
  );
  if (days <= 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 7) return `há ${days} dias`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `há ${weeks} ${weeks === 1 ? "semana" : "semanas"}`;
  }
  const months = Math.floor(days / 30);
  return `há ${months} ${months === 1 ? "mês" : "meses"}`;
};

/** Data e hora por extenso curto ("02/11/2026, 14:30"), para o `title` de datas relativas. */
export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/** Data curta ("02/11/2026"), no horário local. */
export const formatDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");

/** ISO 8601 para o valor do `<input type="datetime-local">` ("2026-11-05T10:00"), no horário local. */
export const toDateTimeLocal = (iso: string) => {
  const date = new Date(iso);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
