import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardAdditionalInfo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About This Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground space-y-2 text-sm">
        <p>
          This dashboard monitors the health of the Simple RAG application and
          its dependencies.
        </p>
        <ul className="ml-2 list-inside list-disc space-y-1">
          <li>
            <strong>Database:</strong> Checks PostgreSQL connectivity
          </li>
          <li>
            <strong>Memory Heap:</strong> Monitors heap memory usage (alert at
            300MB)
          </li>
          <li>
            <strong>Memory RSS:</strong> Monitors resident set size (alert at
            500MB)
          </li>
          <li>
            <strong>Disk Storage:</strong> Monitors disk usage (alert at 90%)
          </li>
          <li>
            <strong>RAG Service:</strong> Shows instrument count and service
            readiness
          </li>
        </ul>
        <p className="pt-2">
          Data refreshes automatically every 30 seconds or can be manually
          refreshed using the Refresh button.
        </p>
      </CardContent>
    </Card>
  );
};

export default DashboardAdditionalInfo;
