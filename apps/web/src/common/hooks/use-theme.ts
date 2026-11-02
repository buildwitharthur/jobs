import { useState } from "react";

export type Theme = "dark" | "light";

const THEME_KEY = "candidaturas-theme";
// Mesmas cores do `theme-color` no index.html (fundo `bg` de cada tema).
const THEME_COLOR: Record<Theme, string> = { dark: "#020617", light: "#f8fafc" };

const currentTheme = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

/** Tema do app (`data-theme` no `<html>`), salvo no navegador. O index.html aplica o salvo antes de pintar. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    document
      .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLOR[next]);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Sem acesso ao localStorage: o tema vale só até recarregar.
    }
    setTheme(next);
  };

  return { theme, toggleTheme };
}
