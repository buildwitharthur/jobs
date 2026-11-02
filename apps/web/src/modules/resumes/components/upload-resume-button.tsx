import { useRef, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { Button } from "../../../common/components/ui/button";
import { useUploadResume } from "../hooks/use-upload-resume";

/** Botão "Enviar PDF" (ui.md, Tela 4): abre o seletor de arquivo e cadastra o currículo. */
export function UploadResumeButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useUploadResume();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Limpa o campo para poder escolher o mesmo arquivo de novo.
    event.target.value = "";
    if (file) mutate(file);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={handleChange}
        aria-label="Arquivo PDF do currículo"
      />
      <Button disabled={isPending} onClick={() => inputRef.current?.click()}>
        <Upload aria-hidden />
        {isPending ? "Enviando..." : "Enviar PDF"}
      </Button>
    </>
  );
}
