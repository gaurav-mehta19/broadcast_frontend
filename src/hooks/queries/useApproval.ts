import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { approvalApi, type ApprovalFilters } from '@/lib/api/approval.api';
import { QUERY_KEYS } from '@/lib/constants';
import { toast } from 'sonner';

export const usePendingApprovals = (params?: { page?: number; limit?: number }) =>
  useQuery({
    queryKey: QUERY_KEYS.PENDING_APPROVALS(params),
    queryFn: () => approvalApi.pending(params).then((r) => r.data),
  });

export const useAllContent = (filters?: ApprovalFilters) =>
  useQuery({
    queryKey: QUERY_KEYS.ALL_CONTENT(filters),
    queryFn: () => approvalApi.all(filters).then((r) => r.data),
  });

export const useApproveContent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approvalApi.approve(id).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['approval'] });
      toast.success('Content approved');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? 'Approval failed');
    },
  });
};

export const useRejectContent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      approvalApi.reject(id, reason).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['approval'] });
      toast.success('Content rejected');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? 'Rejection failed');
    },
  });
};
