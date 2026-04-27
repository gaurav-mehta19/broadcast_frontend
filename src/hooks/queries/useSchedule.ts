import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleApi } from '@/lib/api/schedule.api';
import { toast } from 'sonner';

export function useRemoveSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: string) => scheduleApi.remove(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'my'] });
      toast.success('Removed from rotation schedule');
    },
    onError: () => {
      toast.error('Failed to remove from schedule');
    },
  });
}
