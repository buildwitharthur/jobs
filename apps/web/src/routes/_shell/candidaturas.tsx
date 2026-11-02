import { createFileRoute } from "@tanstack/react-router";
import { ApplicationsScreen } from "../../modules/applications/screens/applications.screen";

export const Route = createFileRoute("/_shell/candidaturas")({
  component: ApplicationsScreen,
});
