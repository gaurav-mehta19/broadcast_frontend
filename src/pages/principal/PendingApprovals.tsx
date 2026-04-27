import { useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { DataTable, type Column } from '@/components/common/DataTable';
import { RejectDialog } from '@/components/forms/RejectDialog';
import { usePendingApprovals, useApproveContent, useRejectContent } from '@/hooks/queries/useApproval';
import type { Content } from '@/types';
import { formatDate } from '@/lib/utils';

export function PendingApprovals() {
  const [page, setPage] = useState(1);
  const [rejectId, setRejectId] = useState<string | undefined>(undefined);

  const { data, isLoading } = usePendingApprovals({ page, limit: 10 });
  const { mutate: approve, isPending: approving } = useApproveContent();
  const { mutate: reject, isPending: rejecting } = useRejectContent();

  const columns: Column<Content>[] = [
    {
      header: 'Preview', key: 'fileUrl',
      render: (c) => (
        <img
          src={c.fileUrl}
          alt={c.title}
          className="h-10 w-16 object-cover rounded"
        />
      ),
    },
    { header: 'Title', key: 'title', render: (c) => <span className="font-medium">{c.title}</span> },
    { header: 'Subject', key: 'subject', render: (c) => <span className="capitalize">{c.subject}</span> },
    { header: 'Teacher', key: 'uploadedBy', render: (c) => c.uploadedBy?.name ?? '—' },
    { header: 'Status', key: 'status', render: (c) => <StatusBadge status={c.status} /> },
    { header: 'Uploaded', key: 'createdAt', render: (c) => formatDate(c.createdAt) },
    {
      header: 'Actions', key: 'id',
      render: (c) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => approve(c.id)} disabled={approving}>Approve</Button>
          <Button size="sm" variant="destructive" onClick={() => setRejectId(c.id)} disabled={rejecting}>Reject</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Pending Approvals" description="Review and approve submitted content" />

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="All caught up!" description="No content waiting for review" />
      ) : (
        <DataTable<Content> columns={columns} data={data?.data ?? []} loading={isLoading} />
      )}

      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">Page {page} of {data.pagination.totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      <RejectDialog
        open={!!rejectId}
        onOpenChange={(open) => !open && setRejectId(undefined)}
        onConfirm={(reason) => {
          if (rejectId) {
            reject({ id: rejectId, reason }, { onSuccess: () => setRejectId(undefined) });
          }
        }}
        loading={rejecting}
      />
    </div>
  );
}
