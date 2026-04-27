import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleApi } from '@/lib/api/schedule.api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  duration: z.number().int().min(1, 'Min 1 minute').max(1440, 'Max 1440 minutes'),
  rotationOrder: z.number().int().min(0).optional(),
});

type FormData = { duration: number; rotationOrder?: number };

interface ScheduleFormProps { contentId: string; onSuccess?: () => void; }

export function ScheduleForm({ contentId, onSuccess }: ScheduleFormProps) {
  const qc = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { duration: 5 },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) =>
      scheduleApi.create({ contentId, duration: data.duration, rotationOrder: data.rotationOrder }).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['content', 'my'] });
      toast.success('Added to rotation schedule');
      onSuccess?.();
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? 'Failed to schedule');
    },
  });

  const onSubmit = (data: FormData) => {
    mutate({ duration: Number(data.duration), rotationOrder: data.rotationOrder !== undefined ? Number(data.rotationOrder) : undefined });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="duration">Duration (minutes) *</Label>
        <Input id="duration" type="number" min={1} max={1440} {...register('duration', { valueAsNumber: true })} />
        {errors.duration && <p className="text-destructive text-xs">{errors.duration.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="rotationOrder">Rotation Order (optional)</Label>
        <Input id="rotationOrder" type="number" min={0} placeholder="Auto-assigned if empty" {...register('rotationOrder', { valueAsNumber: true })} />
      </div>
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
        Add to Rotation
      </Button>
    </form>
  );
}
