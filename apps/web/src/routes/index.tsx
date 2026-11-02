import { createFileRoute, redirect } from "@tanstack/react-router";

// A tela inicial é o kanban de candidaturas.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/candidaturas" });
  },
});
