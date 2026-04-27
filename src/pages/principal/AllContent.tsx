import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { DataTable, type Column } from '@/components/common/DataTable';
import { RejectDialog } from '@/components/forms/RejectDialog';
import { useAllContent, useApproveContent, useRejectContent } from '@/hooks/queries/useApproval';
import type { Content } from '@/types';
import { formatDate } from '@/lib/utils';

export function AllContent() {
  const [status, setStatus] = useState('all');
  const [subject, setSubject] = useState('');
  const [page, setPage] = useState(1);
  const [rejectId, setRejectId] = useState<string | undefined>(undefined);

  const { data, isLoading } = useAllContent({
    status: status === 'all' ? undefined : status,
    subject: subject || undefined,
    page, limit: 10,
  });

  const { mutate: approve, isPending: approving } = useApproveContent();
  const { mutate: reject, isPending: rejecting } = useRejectContent();

  const columns: Column<Content>[] = [
    {
      header: 'Preview', key: 'fileUrl',
      render: (c) => (
        <img src={c.fileUrl} alt={c.title} className="h-10 w-16 object-cover rounded" />
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
          {c.status === 'PENDING' && (
            <>
              <Button size="sm" onClick={() => approve(c.id)} disabled={approving}>Approve</Button>
              <Button size="sm" variant="destructive" onClick={() => setRejectId(c.id)} disabled={rejecting}>Reject</Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="All Content" description="Browse and manage all uploaded content" />

      <div className="flex flex-wrap gap-3 mb-4">
        <Select value={status} onValueChange={(v) => { setStatus(v ?? 'all'); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Filter by subject..."
          className="w-48"
          value={subject}
          onChange={(e) => { setSubject(e.target.value); setPage(1); }}
        />
      </div>

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState icon={BookOpen} title="No content found" description="Try adjusting your filters" />
      ) : (
        <DataTable<Content> columns={columns} data={data?.data ?? []} loading={isLoading} />
      )}

      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">Page {page} of {data.pagination.totalPages} · {data.pagination.total} items</p>
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
          if (rejectId) reject({ id: rejectId, reason }, { onSuccess: () => setRejectId(undefined) });
        }}
        loading={rejecting}
      />
    </div>
  );
}
