import { Upload } from "lucide-react";
import { useResumes } from "../hooks/use-resumes";
import { ResumeCard } from "./resume-card";

/**
 * Lista de currículos: lê o cache (que o loader da rota já encheu) e repassa cada currículo ao
 * card. Sem currículos, mostra a área "Arraste um PDF aqui".
 */
export function ResumeList() {
  const { data: resumes = [] } = useResumes();

  if (resumes.length === 0) {
    return (
      <div className="gap-xs border-border-input bg-surface-sunken p-xxl text-text-secondary flex flex-col items-center rounded-lg border border-dashed text-center">
        <Upload className="size-4" aria-hidden />
        <p className="text-heading">Arraste um PDF aqui</p>
        <p>ou use o botão &quot;Enviar PDF&quot;.</p>
      </div>
    );
  }

  return (
    <>
      <p className="mb-md text-text-secondary">
        Arraste um PDF para qualquer lugar da tela para cadastrar um currículo, ou sobre um card
        para trocar o arquivo dele.
      </p>
      <div className="gap-md grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
        {resumes.map((resume) => (
          <ResumeCard key={resume.id} resume={resume} />
        ))}
      </div>
    </>
  );
}
