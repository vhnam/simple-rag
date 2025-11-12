import { AlertCircleIcon, BookOpenIcon, CheckCircle2Icon } from 'lucide-react';
import type { RagStatusResponse } from '@/queries/rag/rag.types';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardRagServiceProps {
  ragData: RagStatusResponse;
  ragLoading: boolean;
  ragError: Error | null;
}

const DashboardRagService = ({
  ragData,
  ragLoading,
  ragError,
}: DashboardRagServiceProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpenIcon className="h-5 w-5" />
            <CardTitle>RAG Service</CardTitle>
          </div>
          {ragLoading ? (
            <Skeleton className="h-6 w-16" />
          ) : ragData ? (
            <Badge variant={ragData.ready ? 'default' : 'secondary'}>
              {ragData.ready ? 'READY' : 'NOT READY'}
            </Badge>
          ) : null}
        </div>
        <CardDescription>
          Recipe retrieval and AI generation service
        </CardDescription>
      </CardHeader>
      <CardContent>
        {ragError ? (
          <div className="text-destructive flex items-center gap-2">
            <AlertCircleIcon className="h-4 w-4" />
            <span>Failed to fetch RAG status</span>
          </div>
        ) : ragData ? (
          <div className="space-y-4">
            <div className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
              <div>
                <p className="text-sm font-medium">Recipes in Database</p>
                <p className="text-muted-foreground text-xs">
                  Total indexed recipes available for queries
                </p>
              </div>
              <div className="text-2xl font-bold">{ragData.count}</div>
            </div>
            <div className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
              <div>
                <p className="text-sm font-medium">Service Status</p>
                <p className="text-muted-foreground text-xs">
                  {ragData.ready
                    ? 'Service is operational and ready for queries'
                    : 'Service requires recipes to be added to the database'}
                </p>
              </div>
              {ragData.ready ? (
                <CheckCircle2Icon className="h-6 w-6 text-green-600" />
              ) : (
                <AlertCircleIcon className="h-6 w-6 text-yellow-600" />
              )}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default DashboardRagService;
