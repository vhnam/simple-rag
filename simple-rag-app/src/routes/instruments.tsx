import { createFileRoute } from '@tanstack/react-router';

import { Instruments } from '@/modules/instruments';

export const Route = createFileRoute('/instruments')({
  component: Instruments,
});

