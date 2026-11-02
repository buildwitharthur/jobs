import { createFileRoute } from "@tanstack/react-router";
import { DashboardScreen } from "../modules/dashboard/screens/dashboard.screen";

export const Route = createFileRoute("/painel")({
  component: DashboardScreen,
});
