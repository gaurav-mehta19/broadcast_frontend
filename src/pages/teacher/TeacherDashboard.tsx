import { Upload, FileText, Clock, CheckCircle, Tv, Copy, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { PageHeader } from '@/components/common/PageHeader';
import { useMyContent } from '@/hooks/queries/useContent';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

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

export function TeacherDashboard() {
  const { user } = useAuth();
  const { data: all, isLoading } = useMyContent({ limit: 100 });
  const { data: pending } = useMyContent({ status: 'PENDING', limit: 100 });
  const { data: approved } = useMyContent({ status: 'APPROVED', limit: 100 });

  const broadcastUrl = user ? `${window.location.origin}/live/${user.id}` : '';

  const copyUrl = () => {
    navigator.clipboard.writeText(broadcastUrl);
    toast.success('Broadcast URL copied to clipboard');
  };

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ')[0]}`}
        description="Manage your educational content"
        action={<ButtonLink to="/teacher/upload"><Upload className="mr-2 h-4 w-4" />Upload Content</ButtonLink>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Uploads" value={all?.pagination.total ?? 0} icon={FileText} loading={isLoading} />
        <StatCard title="Pending" value={pending?.pagination.total ?? 0} icon={Clock} loading={isLoading} />
        <StatCard title="Approved" value={approved?.pagination.total ?? 0} icon={CheckCircle} loading={isLoading} />
        <StatCard title="Rejected" value={(all?.pagination.total ?? 0) - (pending?.pagination.total ?? 0) - (approved?.pagination.total ?? 0)} icon={FileText} loading={isLoading} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Content</CardTitle>
          </CardHeader>
          <CardContent>
            <ButtonLink to="/teacher/content" variant="outline">View All Content</ButtonLink>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Tv className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">My Live Broadcast</CardTitle>
            </div>
            <CardDescription>
              Share this URL to display your scheduled content on any screen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2 text-sm font-mono break-all">
              {broadcastUrl}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyUrl}>
                <Copy className="h-3 w-3 mr-1" />
                Copy URL
              </Button>
              <ButtonLink to={`/live/${user?.id}`} variant="outline" size="sm" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Open Broadcast
              </ButtonLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
