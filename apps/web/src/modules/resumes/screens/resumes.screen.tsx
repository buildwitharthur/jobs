import { Plus } from "lucide-react";
import { Button } from "../../../common/components/ui/button";
import { CreateApplicationDialog } from "../../applications/components/create-application-dialog";
import { Kbd } from "../../applications/components/kbd";
import { PdfDropOverlay } from "../components/pdf-drop-overlay";
import { ResumeList } from "../components/resume-list";
import { UploadResumeButton } from "../components/upload-resume-button";

export function ResumesScreen() {
  return (
    <>
      <header className="gap-sm px-xl pt-lg pb-md flex flex-wrap items-center">
        <h1 className="text-display mr-xs">Currículos</h1>
        <div className="flex-1" />
        <CreateApplicationDialog>
          <Button variant="secondary">
            <Plus aria-hidden />
            Nova candidatura
            <Kbd>N</Kbd>
          </Button>
        </CreateApplicationDialog>
        <UploadResumeButton />
      </header>
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="px-xl pb-xxl max-w-300">
          <ResumeList />
        </div>
      </div>
      <PdfDropOverlay />
    </>
  );
}
