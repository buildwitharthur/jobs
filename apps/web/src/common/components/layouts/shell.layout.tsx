import { Link, Outlet } from "@tanstack/react-router";
import { ChartColumn, FileText, Moon, SquareKanban, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "../../hooks/use-theme";

const NAV_ITEMS = [
  { to: "/candidaturas", label: "Candidaturas", icon: SquareKanban },
  { to: "/curriculos", label: "Currículos", icon: FileText },
  { to: "/painel", label: "Painel", icon: ChartColumn },
] as const;

/** Layout das páginas do app: menu lateral fixo e a página atual ao lado. */
export function ShellLayout() {
  return (
    <div className="grid h-screen grid-cols-[var(--spacing-nav)_1fr]">
      <ShellNav />
      <main id="main" tabIndex={-1} className="flex h-screen min-w-0 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

function ShellNav() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      aria-label="Navegação principal"
      className="gap-md border-border bg-surface px-xs py-md flex flex-col border-r"
    >
      <Link
        to="/candidaturas"
        aria-label="Candidaturas — início"
        className="px-sm pt-xxs pb-xs block"
      >
        <img
          src={theme === "light" ? "/logo.svg" : "/logo-on-dark.svg"}
          alt="Candidaturas"
          width={130}
          height={32}
          className="block h-8 w-auto"
        />
      </Link>

      <ul className="gap-xxs flex flex-col">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ includeSearch: false }}
              className="h-control-md gap-xs px-sm flex items-center rounded-md font-medium transition-colors"
              activeProps={{ className: "bg-primary-subtle text-primary-subtle-text" }}
              inactiveProps={{
                className: "text-text-secondary hover:bg-surface-sunken hover:text-text-primary",
              }}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="gap-xs px-xxs mt-auto flex flex-col">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="min-h-control-sm py-xxs h-auto justify-start text-left whitespace-normal"
        >
          {theme === "light" ? <Moon aria-hidden /> : <Sun aria-hidden />}
          {theme === "light" ? "Usar tema escuro" : "Usar tema claro"}
        </Button>
      </div>
    </nav>
  );
}
