import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contentApi, type ContentFilters } from '@/lib/api/content.api';
import { QUERY_KEYS } from '@/lib/constants';
import { toast } from 'sonner';

export const useMyContent = (filters?: ContentFilters) =>
  useQuery({
    queryKey: QUERY_KEYS.MY_CONTENT(filters),
    queryFn: () => contentApi.myContent(filters).then((r) => r.data),
  });

export const useContentById = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.CONTENT_BY_ID(id),
    queryFn: () => contentApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });

export const useUploadContent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => contentApi.upload(formData).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['content', 'my'] });
      toast.success('Content uploaded successfully');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? 'Upload failed');
    },
  });
};

export const useDeleteContent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contentApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['content', 'my'] });
      toast.success('Content deleted');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? 'Failed to delete content');
    },
  });
};
