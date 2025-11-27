import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, FileText, Plus } from "lucide-react";

interface CollectionCardProps {
  name: string;
  docCount: number;
  onAddDoc: () => void;
}

export default function CollectionCard({ name, docCount, onAddDoc }: CollectionCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Folder className="h-5 w-5 text-blue-500" />
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{docCount}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <FileText className="h-3 w-3" /> Documents
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full gap-2" onClick={onAddDoc}>
          <Plus className="h-4 w-4" /> Add Document
        </Button>
      </CardFooter>
    </Card>
  );
}
