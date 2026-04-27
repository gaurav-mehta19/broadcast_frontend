import { Link, Navigate } from 'react-router-dom';
import { Radio } from 'lucide-react';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';

export function Register() {
  const { user } = useAuth();
  if (user) return <Navigate to={user.role === 'TEACHER' ? '/teacher/dashboard' : '/principal/dashboard'} replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <Radio className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">Content Broadcasting</span>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Create account</h2>
          <p className="text-sm text-muted-foreground mb-6">Join the broadcasting platform</p>
          <RegisterForm />
          <p className="text-sm text-center mt-4 text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary underline underline-offset-2">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
