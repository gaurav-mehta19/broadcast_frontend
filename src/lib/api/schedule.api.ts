import { apiClient } from './client';
import type { ScheduleEntry } from '@/types';

export const scheduleApi = {
  create: (data: { contentId: string; duration: number; rotationOrder?: number }) =>
    apiClient.post<{ data: ScheduleEntry }>('/schedule', data),
  getBySubject: (subject: string) =>
    apiClient.get<{ data: ScheduleEntry[] }>(`/schedule/subject/${subject}`),
  remove: (id: string) => apiClient.delete(`/schedule/${id}`),
};
