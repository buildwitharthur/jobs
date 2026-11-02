import { createFileRoute } from "@tanstack/react-router";
import { ResumesScreen } from "../../modules/resumes/screens/resumes.screen";

export const Route = createFileRoute("/_shell/curriculos")({
  component: ResumesScreen,
});
