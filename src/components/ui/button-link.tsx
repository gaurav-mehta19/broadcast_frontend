import { Link, type LinkProps } from 'react-router-dom';
import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from './button';
import { cn } from '@/lib/utils';

type ButtonLinkProps = LinkProps & VariantProps<typeof buttonVariants> & { className?: string };

export function ButtonLink({ to, children, variant = 'default', size = 'default', className, ...props }: ButtonLinkProps) {
  return (
    <Link to={to} className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {children}
    </Link>
  );
}
