import { RefreshCwIcon } from 'lucide-react';
import DashboardAdditionalInfo from './dashboard-additional-info';
import DashboardRagService from './dashboard-rag-service';
import DashboardOverview from './dashboard-overview';
import { useRagStatus } from '@/queries/rag';
import { useHealthCheck } from '@/queries/health/health.queries';
import ProtectedLayoutContent from '@/layouts/protected-layout/protected-layout-content';
import { ProtectedLayoutHeader } from '@/layouts/protected-layout';
import { Button } from '@/components/ui/button';

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
    <div>
      <ProtectedLayoutHeader title="Dashboard">
        <Button variant="default" size="sm" onClick={handleRefresh}>
          <RefreshCwIcon className="size-4" />
          Refresh
        </Button>
      </ProtectedLayoutHeader>
      <ProtectedLayoutContent>
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
      </ProtectedLayoutContent>
    </div>
  );
};

export default Dashboard;
