import { createFileRoute } from "@tanstack/react-router";
import { resumesQueryKey } from "../../modules/resumes/hooks/use-resumes";
import { listResumes } from "../../modules/resumes/http/list-resumes.http";
import { ResumesScreen } from "../../modules/resumes/screens/resumes.screen";

export const Route = createFileRoute("/_shell/curriculos")({
  // Busca a lista antes de abrir a tela (e ao passar o mouse no link, pelo preload): a tela lê o
  // mesmo cache com o useResumes.
  loader: ({ context }) =>
    context.queryClient.query({ queryKey: resumesQueryKey(), queryFn: listResumes }),
  component: ResumesScreen,
});
