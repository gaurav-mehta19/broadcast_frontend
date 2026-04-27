import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/common/PageHeader';
import { ContentUploadForm } from '@/components/forms/ContentUploadForm';

export function UploadContent() {
  return (
    <div>
      <PageHeader title="Upload Content" description="Share educational materials with your students" />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Content Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentUploadForm />
        </CardContent>
      </Card>
    </div>
  );
}
