import { useEffect, useRef, useState } from "react";
import { isFileDrag } from "../utils/file-drag";

/**
 * Escuta o arrasto de arquivos sobre a tela inteira. Devolve `true` enquanto um arquivo está sendo
 * arrastado e chama `onDrop` com o primeiro arquivo solto. Soltar sobre um card é tratado pelo
 * card (ele para a propagação), e então `onDrop` não é chamado.
 */
export const usePdfDrop = (onDrop: (file: File) => void) => {
  const [dragging, setDragging] = useState(false);
  const onDropRef = useRef(onDrop);

  useEffect(() => {
    onDropRef.current = onDrop;
  });

  useEffect(() => {
    // O dragenter/dragleave dispara também ao entrar e sair dos elementos filhos: conta as entradas.
    let depth = 0;

    const handleDragEnter = (event: DragEvent) => {
      if (!isFileDrag(event)) return;
      depth += 1;
      setDragging(true);
    };

    const handleDragLeave = (event: DragEvent) => {
      if (!isFileDrag(event)) return;
      depth = Math.max(0, depth - 1);
      if (depth === 0) setDragging(false);
    };

    // Sem o preventDefault, o navegador abre o PDF em vez de deixar soltar.
    const handleDragOver = (event: DragEvent) => {
      if (!isFileDrag(event)) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    };

    // Na captura, para limpar o aviso mesmo quando o card para a propagação.
    const handleDropCapture = (event: DragEvent) => {
      if (!isFileDrag(event)) return;
      depth = 0;
      setDragging(false);
    };

    const handleDrop = (event: DragEvent) => {
      if (!isFileDrag(event)) return;
      event.preventDefault();
      const file = event.dataTransfer?.files[0];
      if (file) onDropRef.current(file);
    };

    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDropCapture, true);
    document.addEventListener("drop", handleDrop);
    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDropCapture, true);
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

  return dragging;
};
