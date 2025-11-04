import { createFileRoute } from '@tanstack/react-router';
import { Landing } from '@/modules/landing';

export const Route = createFileRoute('/')({
  component: Landing,
});
