/** Data de hoje (UTC) à meia-noite, para campos que guardam só a data. */
export const todayUtc = (): Date => {
  const now = new Date();

  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

/** Data de `days` dias atrás (UTC) à meia-noite. */
export const daysAgoUtc = (days: number): Date => {
  const date = todayUtc();
  date.setUTCDate(date.getUTCDate() - days);

  return date;
};
