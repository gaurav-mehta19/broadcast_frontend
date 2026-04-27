import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUploadContent } from '@/hooks/queries/useContent';
import { Loader2, Upload } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  subject: z.string().min(1, 'Subject is required'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  file: z.custom<FileList>((v) => v instanceof FileList && v.length > 0, 'File is required'),
}).refine((d) => {
  if (d.startTime && d.endTime) return new Date(d.startTime) < new Date(d.endTime);
  return true;
}, { message: 'Start time must be before end time', path: ['startTime'] });

type FormData = z.infer<typeof schema>;

export function ContentUploadForm() {
  const navigate = useNavigate();
  const { mutate, isPending } = useUploadContent();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('subject', data.subject.toLowerCase());
    if (data.description) formData.append('description', data.description);
    if (data.startTime) formData.append('startTime', new Date(data.startTime).toISOString());
    if (data.endTime) formData.append('endTime', new Date(data.endTime).toISOString());
    formData.append('file', data.file[0]);

    mutate(formData, { onSuccess: () => navigate('/teacher/content') });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" placeholder="e.g. Introduction to Algebra" {...register('title')} />
        {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" placeholder="Optional description" {...register('description')} />
        {errors.description && <p className="text-destructive text-xs">{errors.description.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject *</Label>
        <Input id="subject" placeholder="e.g. maths, science, history" {...register('subject')} />
        {errors.subject && <p className="text-destructive text-xs">{errors.subject.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input id="startTime" type="datetime-local" {...register('startTime')} />
          {errors.startTime && <p className="text-destructive text-xs">{errors.startTime.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input id="endTime" type="datetime-local" {...register('endTime')} />
          {errors.endTime && <p className="text-destructive text-xs">{errors.endTime.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">Image File * (JPG, PNG, GIF — max 10MB)</Label>
        <Input id="file" type="file" accept="image/jpeg,image/png,image/gif" {...register('file')} />
        {errors.file && <p className="text-destructive text-xs">{String(errors.file.message)}</p>}
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
        Upload Content
      </Button>
    </form>
  );
}
