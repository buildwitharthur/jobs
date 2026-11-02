import { useUploadResume } from "../hooks/use-upload-resume";
import { usePdfDrop } from "../hooks/use-pdf-drop";

/**
 * Aviso de tela inteira enquanto um PDF é arrastado: soltar em qualquer lugar cadastra um
 * currículo novo (sobre um card, o arquivo daquele currículo é trocado, pelo próprio card).
 */
export function PdfDropOverlay() {
  const { mutate } = useUploadResume();
  const dragging = usePdfDrop(mutate);

  if (!dragging) return null;

  return (
    <div className="p-xxl bg-drop-overlay pointer-events-none fixed inset-0 z-35 flex items-center justify-center">
      <div className="border-primary text-primary-subtle-text text-heading flex size-full items-center justify-center rounded-lg border-2 border-dashed">
        Solte o PDF para cadastrar um currículo
      </div>
    </div>
  );
}
