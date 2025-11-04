import { createFileRoute } from '@tanstack/react-router';
import { Chat } from '@/modules/chat';

export const Route = createFileRoute('/chat')({
  component: Chat,
});
