export type Role = 'PRINCIPAL' | 'TEACHER';
export type ContentStatus = 'UPLOADED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface ContentSchedule {
  id: string;
  contentId: string;
  slotId: string;
  rotationOrder: number;
  duration: number;
  createdAt: string;
  slot: ContentSlot;
}

export interface ContentSlot {
  id: string;
  subject: string;
  createdAt: string;
}

export interface Content {
  id: string;
  title: string;
  description?: string;
  subject: string;
  filePath: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedById: string;
  status: ContentStatus;
  rejectionReason?: string;
  approvedById?: string;
  approvedAt?: string;
  startTime?: string;
  endTime?: string;
  createdAt: string;
  uploadedBy: Pick<User, 'id' | 'name' | 'email' | 'role'>;
  approvedBy?: Pick<User, 'id' | 'name' | 'email' | 'role'>;
  schedule?: ContentSchedule;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface BroadcastData {
  content: Content & { fileUrl: string };
  secondsRemaining: number;
  totalInRotation: number;
  currentIndex: number;
}

export interface ScheduleEntry {
  id: string;
  contentId: string;
  slotId: string;
  rotationOrder: number;
  duration: number;
  createdAt: string;
  content: Content;
  slot: ContentSlot;
}
