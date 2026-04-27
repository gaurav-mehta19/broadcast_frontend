import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ContentStatus } from '@/types';

const config: Record<ContentStatus, { label: string; className: string }> = {
  UPLOADED: { label: 'Uploaded', className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' },
  PENDING: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  APPROVED: { label: 'Approved', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  const { label, className } = config[status];
  return (
    <Badge variant="outline" className={cn('font-medium border-transparent', className)}>
      {label}
    </Badge>
  );
}
