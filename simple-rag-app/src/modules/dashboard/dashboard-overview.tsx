import {
  ActivityIcon,
  AlertCircleIcon,
  DatabaseIcon,
  HardDriveIcon,
  MemoryStickIcon,
} from 'lucide-react';
import StatusBadge from './dashboard-status-badge';
import type { HealthCheckResponse } from '@/queries/health';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardOverviewProps {
  healthData: HealthCheckResponse;
  healthLoading: boolean;
  healthError: Error | null;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const formatPercentage = (value: number): string => {
  return (value * 100).toFixed(2) + '%';
};

const DashboardOverview = ({
  healthData,
  healthLoading,
  healthError,
}: DashboardOverviewProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ActivityIcon className="size-5" />
              <CardTitle>System Status</CardTitle>
            </div>
            {healthLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <StatusBadge status={healthData.status} />
            )}
          </div>
          <CardDescription>Overall system health check</CardDescription>
        </CardHeader>
        <CardContent>
          {healthError && (
            <div className="text-destructive flex items-center gap-2">
              <AlertCircleIcon className="h-4 w-4" />
              <span>Failed to fetch health status</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <DatabaseIcon className="text-muted-foreground size-5" />
              {healthLoading ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                <StatusBadge status={healthData.details.database.status} />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm font-medium">Database</p>
              <p className="text-muted-foreground text-xs">
                PostgreSQL connection
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <MemoryStickIcon className="text-muted-foreground size-5" />
              {healthLoading ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                <StatusBadge status={healthData.details.memory_heap.status} />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm font-medium">Memory Heap</p>
              {healthData.details.memory_heap.used && (
                <p className="text-muted-foreground text-xs">
                  {formatBytes(healthData.details.memory_heap.used)} used
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <MemoryStickIcon className="text-muted-foreground size-5" />
              {healthLoading ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                <StatusBadge status={healthData.details.memory_rss.status} />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm font-medium">Memory RSS</p>
              {healthData.details.memory_rss.rss && (
                <p className="text-muted-foreground text-xs">
                  {formatBytes(healthData.details.memory_rss.rss)} resident
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <HardDriveIcon className="text-muted-foreground size-5" />
              {healthLoading ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                <StatusBadge status={healthData.details.disk_storage.status} />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm font-medium">Disk Storage</p>
              {healthData.details.disk_storage.percentage !== undefined && (
                <p className="text-muted-foreground text-xs">
                  {formatPercentage(healthData.details.disk_storage.percentage)}{' '}
                  used
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DashboardOverview;
