/** "2026-11-02" a partir de uma Date (UTC). */
export const toIsoDate = (date: Date): string => date.toISOString().slice(0, 10);

/** Date (UTC, meia-noite) a partir de "2026-11-02". */
export const fromIsoDate = (value: string): Date => new Date(`${value}T00:00:00.000Z`);
