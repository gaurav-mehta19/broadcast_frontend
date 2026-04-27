import { useQuery } from '@tanstack/react-query';
import { broadcastApi } from '@/lib/api/broadcast.api';
import { QUERY_KEYS } from '@/lib/constants';

export const useLiveBroadcast = (teacherId: string, subject?: string) =>
  useQuery({
    queryKey: QUERY_KEYS.LIVE_BROADCAST(teacherId, subject),
    queryFn: () => broadcastApi.getLive(teacherId, subject).then((r) => r.data),
    enabled: !!teacherId,
    refetchInterval: 5000,
    staleTime: 0,
  });
