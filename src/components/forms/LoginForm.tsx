import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/lib/api/auth.api';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2, GraduationCap, ShieldCheck } from 'lucide-react';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
type FormData = z.infer<typeof schema>;

const DEMO_CREDENTIALS = {
  teacher:   { email: 'teacher1@school.com',  password: 'Teacher@123' },
  principal: { email: 'principal@school.com', password: 'Principal@123' },
} as const;

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState<'teacher' | 'principal' | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const doLogin = async (data: FormData) => {
    const res = await authApi.login(data);
    const { user, token } = res.data.data;
    login(user, token);
    navigate(user.role === 'TEACHER' ? '/teacher/dashboard' : '/principal/dashboard');
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await doLogin(data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'teacher' | 'principal') => {
    setQuickLoading(role);
    try {
      await doLogin(DEMO_CREDENTIALS[role]);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message ?? 'Login failed');
    } finally {
      setQuickLoading(null);
    }
  };

  const busy = loading || quickLoading !== null;

  return (
    <div className="space-y-4">
      {/* Quick login */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full text-xs"
          disabled={busy}
          onClick={() => handleQuickLogin('teacher')}
        >
          {quickLoading === 'teacher'
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <GraduationCap className="h-3.5 w-3.5" />}
          <span className="ml-1.5">Login as Teacher</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full text-xs"
          disabled={busy}
          onClick={() => handleQuickLogin('principal')}
        >
          {quickLoading === 'principal'
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <ShieldCheck className="h-3.5 w-3.5" />}
          <span className="ml-1.5">Login as Principal</span>
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or sign in manually</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@school.com" {...register('email')} />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
          {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>
    </div>
  );
}
