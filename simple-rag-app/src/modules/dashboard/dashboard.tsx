import { useHealthCheck } from '@/queries/health/health.queries';
import { RefreshCwIcon } from 'lucide-react';
import DashboardAdditionalInfo from './dashboard-additional-info';
import { useRagStatus } from '@/queries/rag';
import DashboardRagService from './dashboard-rag-service';
import DashboardOverview from './dashboard-overview';

const Dashboard = () => {
  const {
    data: healthData,
    isLoading: healthLoading,
    error: healthError,
    refetch: refetchHealth,
  } = useHealthCheck();

  const {
    data: ragData,
    isLoading: ragLoading,
    error: ragError,
    refetch: refetchRag,
  } = useRagStatus();

  const handleRefresh = () => {
    refetchHealth();
    refetchRag();
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            System Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor system health and RAG service status
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="hover:bg-accent hover:text-accent-foreground inline-flex items-center gap-2 rounded-md border px-4 py-2 transition-colors"
          aria-label="Refresh dashboard"
        >
          <RefreshCwIcon className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <DashboardOverview
        healthData={healthData ?? { status: 'unknown', details: {} }}
        healthLoading={healthLoading}
        healthError={healthError}
      />

      <DashboardRagService
        ragData={ragData ?? { ready: false, count: 0 }}
        ragLoading={ragLoading}
        ragError={ragError}
      />

      <DashboardAdditionalInfo />
    </div>
  );
};

export default Dashboard;
