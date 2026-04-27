import { useState } from 'react';
import { FileX, Plus, Eye, CalendarPlus, CalendarX, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { DataTable, type Column } from '@/components/common/DataTable';
import { ScheduleForm } from '@/components/forms/ScheduleForm';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMyContent, useDeleteContent } from '@/hooks/queries/useContent';
import { useRemoveSchedule } from '@/hooks/queries/useSchedule';
import type { Content, ContentStatus } from '@/types';
import { formatDate, formatBytes } from '@/lib/utils';

export function MyContent() {
  const [status, setStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [scheduleContentId, setScheduleContentId] = useState<string | undefined>(undefined);
  const [deleteContentId, setDeleteContentId] = useState<string | undefined>(undefined);

  const { data, isLoading } = useMyContent({ status: status === 'all' ? undefined : status, page, limit: 10 });
  const removeSchedule = useRemoveSchedule();
  const deleteContent = useDeleteContent();

  const columns: Column<Content>[] = [
    { header: 'Title', key: 'title', render: (c) => <span className="font-medium">{c.title}</span> },
    { header: 'Subject', key: 'subject', render: (c) => <span className="capitalize">{c.subject}</span> },
    { header: 'Status', key: 'status', render: (c) => <StatusBadge status={c.status as ContentStatus} /> },
    {
      header: 'Rejection Reason', key: 'rejectionReason',
      render: (c) => c.rejectionReason
        ? <span className="text-xs text-destructive whitespace-normal break-words max-w-xs block">{c.rejectionReason}</span>
        : <span className="text-xs text-muted-foreground">—</span>,
    },
    { header: 'Size', key: 'fileSize', render: (c) => formatBytes(c.fileSize) },
    { header: 'Uploaded', key: 'createdAt', render: (c) => formatDate(c.createdAt) },
    {
      header: 'Expires', key: 'endTime',
      render: (c) => {
        if (!c.endTime) return <span className="text-xs text-muted-foreground">Never</span>;
        const expired = new Date(c.endTime) < new Date();
        return (
          <span className={`text-xs ${expired ? 'text-destructive font-medium' : 'text-foreground'}`}>
            {expired ? '⚠ ' : ''}{formatDate(c.endTime)}
          </span>
        );
      },
    },
    {
      header: 'Actions', key: 'id',
      render: (c) => (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(c.fileUrl, '_blank')}
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>

          {c.status === 'APPROVED' && !c.schedule && (
            <Button size="sm" variant="outline" onClick={() => setScheduleContentId(c.id)}>
              <CalendarPlus className="h-3 w-3 mr-1" />
              Schedule
            </Button>
          )}

          {c.status === 'APPROVED' && c.schedule && (
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive"
              disabled={removeSchedule.isPending}
              onClick={() => removeSchedule.mutate(c.schedule!.id)}
            >
              <CalendarX className="h-3 w-3 mr-1" />
              Unschedule
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteContentId(c.id)}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="My Content"
        description="All your uploaded content"
        action={<ButtonLink to="/teacher/upload"><Plus className="mr-2 h-4 w-4" />Upload New</ButtonLink>}
      />

      <div className="flex gap-4 mb-4">
        <Select value={status} onValueChange={(v) => { setStatus(v ?? 'all'); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState
          icon={FileX}
          title="No content yet"
          description="Upload your first educational content to get started"
          action={<ButtonLink to="/teacher/upload">Upload Content</ButtonLink>}
        />
      ) : (
        <DataTable<Content> columns={columns} data={data?.data ?? []} loading={isLoading} />
      )}

      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">
            Page {page} of {data.pagination.totalPages} · {data.pagination.total} items
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      {scheduleContentId && (
        <Card className="mt-6 max-w-sm">
          <CardHeader>
            <CardTitle className="text-sm">Add to Rotation Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <ScheduleForm contentId={scheduleContentId} onSuccess={() => setScheduleContentId(undefined)} />
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={!!deleteContentId}
        onOpenChange={(open) => { if (!open) setDeleteContentId(undefined); }}
        title="Delete content?"
        description="This will permanently delete the content and remove it from the broadcast schedule. This cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteContent.isPending}
        onConfirm={() => {
          if (deleteContentId) {
            deleteContent.mutate(deleteContentId, { onSuccess: () => setDeleteContentId(undefined) });
          }
        }}
      />
    </div>
  );
}
