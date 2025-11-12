import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'up' | 'down' | 'ok' | 'error' | 'shutting_down' | 'unknown';
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const isHealthy = status === 'up' || status === 'ok';
  const variant = isHealthy ? 'default' : 'destructive';
  const Icon = isHealthy ? CheckCircle2Icon : XCircleIcon;

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {status.toUpperCase()}
    </Badge>
  );
};

export default StatusBadge;
