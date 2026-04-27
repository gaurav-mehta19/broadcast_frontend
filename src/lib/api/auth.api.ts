import { apiClient } from './client';
import type { AuthData, User } from '@/types';

interface RegisterPayload { name: string; email: string; password: string; role: 'PRINCIPAL' | 'TEACHER'; }
interface LoginPayload { email: string; password: string; }

export const authApi = {
  register: (data: RegisterPayload) => apiClient.post<{ data: AuthData }>('/auth/register', data),
  login: (data: LoginPayload) => apiClient.post<{ data: AuthData }>('/auth/login', data),
  me: () => apiClient.get<{ data: User }>('/auth/me'),
};
