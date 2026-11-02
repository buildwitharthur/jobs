import { Suspense } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../common/components/ui/button";
import { Board, BoardSkeleton } from "../components/board";
import { CreateApplicationDialog } from "../components/create-application-dialog";
import { Kbd } from "../components/kbd";

export function ApplicationsScreen() {
  return (
    <>
      <header className="gap-sm px-xl pt-lg pb-md flex flex-wrap items-center">
        <h1 className="text-display mr-xs">Candidaturas</h1>
        <div className="flex-1" />
        <CreateApplicationDialog>
          <Button>
            <Plus aria-hidden />
            Nova candidatura
            <Kbd className="bg-primary-hover text-on-primary border-transparent">N</Kbd>
          </Button>
        </CreateApplicationDialog>
      </header>
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden">
        <Suspense fallback={<BoardSkeleton />}>
          <Board />
        </Suspense>
      </div>
    </>
  );
}
