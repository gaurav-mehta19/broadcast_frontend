import { ClipboardList, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonLink } from '@/components/ui/button-link';
import { PageHeader } from '@/components/common/PageHeader';
import { useAllContent, usePendingApprovals } from '@/hooks/queries/useApproval';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

function StatCard({ title, value, icon: Icon, loading }: { title: string; value: number; icon: React.ElementType; loading: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-8 w-12" /> : <p className="text-2xl font-bold">{value}</p>}
      </CardContent>
    </Card>
  );
}

export function PrincipalDashboard() {
  const { user } = useAuth();
  const { data: pending, isLoading: pendingLoading } = usePendingApprovals({ limit: 1 });
  const { data: approved, isLoading: approvedLoading } = useAllContent({ status: 'APPROVED', limit: 1 });
  const { data: all, isLoading: allLoading } = useAllContent({ limit: 1 });

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ')[0]}`}
        description="Manage content approvals"
        action={<ButtonLink to="/principal/pending"><ClipboardList className="mr-2 h-4 w-4" />Review Pending</ButtonLink>}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Pending Review" value={pending?.pagination.total ?? 0} icon={Clock} loading={pendingLoading} />
        <StatCard title="Approved" value={approved?.pagination.total ?? 0} icon={CheckCircle} loading={approvedLoading} />
        <StatCard title="Total Content" value={all?.pagination.total ?? 0} icon={BookOpen} loading={allLoading} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Pending Approvals</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-3">Review and approve teacher submissions</p>
            <ButtonLink to="/principal/pending">Review Now</ButtonLink>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">All Content</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-3">Browse all content with filters</p>
            <ButtonLink to="/principal/all" variant="outline">Browse</ButtonLink>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
