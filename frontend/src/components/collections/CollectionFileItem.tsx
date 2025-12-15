import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, Trash2, Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import type { RAGDocumentListSchema } from "@/gen/types/RAGDocumentListSchema";

import type { IndexingStatusResponseSchema } from "@/gen/types/IndexingStatusResponseSchema";

interface CollectionFileItemProps {
  file: RAGDocumentListSchema;
  onIndexFile: (fileId: string) => void;
  onDelete: (fileId: string) => void;
  indexingStatus?: IndexingStatusResponseSchema | null;
}

export function CollectionFileItem({
  file,
  onIndexFile,
  onDelete,
  indexingStatus,
}: CollectionFileItemProps) {
  const isIndexed = file.is_indexed || indexingStatus?.status === "SUCCESS";
  const isIndexing =
    indexingStatus?.status === "PENDING" ||
    indexingStatus?.status === "PROGRESS";
  return (
    <div>
      <TooltipProvider>
        <div className="group flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-accent/50 hover:border-accent transition-all duration-200">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-8 w-8 rounded bg-red-50 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-red-500" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate leading-none mb-1">
                {file.unique_document_name}
              </span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                PDF • 2.4 MB
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 pl-2">
            {isIndexed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-7 w-7 flex items-center justify-center cursor-default">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Document is indexed</p>
                </TooltipContent>
              </Tooltip>
            ) : isIndexing ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-7 w-7 flex items-center justify-center cursor-default">
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Indexing: {Math.round(indexingStatus?.progress || 0)}%</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-[10px] gap-1.5 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    disabled={isIndexing}
                    onClick={() =>
                      file.id != null && onIndexFile(file.id.toString())
                    }
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Index
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to knowledge base</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-red-600 hover:bg-red-50"
              onClick={() => file.id != null && onDelete(file.id.toString())}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
