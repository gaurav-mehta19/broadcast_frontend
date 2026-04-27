import { apiClient } from './client';
import type { Content, PaginatedResponse } from '@/types';

export interface ApprovalFilters {
  status?: string;
  subject?: string;
  teacherId?: string;
  page?: number;
  limit?: number;
}

export const approvalApi = {
  pending: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Content>>('/approval/pending', { params }),
  all: (params?: ApprovalFilters) =>
    apiClient.get<PaginatedResponse<Content>>('/approval/all', { params }),
  approve: (id: string) => apiClient.patch<{ data: Content }>(`/approval/${id}/approve`),
  reject: (id: string, rejectionReason: string) =>
    apiClient.patch<{ data: Content }>(`/approval/${id}/reject`, { rejectionReason }),
};
