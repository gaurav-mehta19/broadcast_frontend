import axios from 'axios';
import { env } from '../env';
import type { BroadcastData } from '@/types';

const publicClient = axios.create({ baseURL: env.VITE_API_URL });

export const broadcastApi = {
  getLive: (teacherId: string, subject?: string) => {
    const url = subject
      ? `/content/live/${teacherId}/${subject}`
      : `/content/live/${teacherId}`;
    return publicClient.get<{ success: boolean; data: BroadcastData | null; message?: string }>(url);
  },
};
