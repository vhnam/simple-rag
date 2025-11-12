import { RefreshCwIcon } from 'lucide-react';

import { useHealthCheck } from '@/queries/health/health.queries';
import { useRagStatus } from '@/queries/rag';

import { ProtectedLayoutHeader } from '@/layouts/protected-layout';
import ProtectedLayoutContent from '@/layouts/protected-layout/protected-layout-content';

import { Button } from '@/components/ui/button';

import DashboardAdditionalInfo from './dashboard-additional-info';
import DashboardOverview from './dashboard-overview';
import DashboardRagService from './dashboard-rag-service';

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
