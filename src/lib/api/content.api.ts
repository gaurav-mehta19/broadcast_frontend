import { apiClient } from './client';
import type { Content, PaginatedResponse } from '@/types';

export interface ContentFilters {
  status?: string;
  subject?: string;
  page?: number;
  limit?: number;
}

export const contentApi = {
  upload: (formData: FormData) =>
    apiClient.post<{ data: Content }>('/content/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  myContent: (params?: ContentFilters) =>
    apiClient.get<PaginatedResponse<Content>>('/content/my', { params }),
  getById: (id: string) => apiClient.get<{ data: Content }>(`/content/${id}`),
  delete: (id: string) => apiClient.delete(`/content/${id}`),
};
