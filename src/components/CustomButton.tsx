'use Client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CustomButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost';
  type?: 'button' | 'submit' | 'reset';
}

const CustomButton = ({
  children,
  onClick,
  className,
  disabled = false,
  variant = 'default',
  type = 'button',
}: CustomButtonProps) => {
  const variantClasses: Record<
    NonNullable<CustomButtonProps['variant']>,
    string
  > = {
    default: 'bg-primary text-primary-foreground shadow-xs',
    destructive:
      'bg-destructive text-white shadow-xs focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
    outline:
      'border bg-background shadow-xs dark:bg-input/30 dark:border-input',
    secondary:
      'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
    ghost: '',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  return (
    <button
      type={type}
      className={cn(
        ' transition duration-200 min-h-[46px] cursor-pointer min-w-[70px] sm:min-w-[85px] tracking-wider px-3 text-nowrap',
        variantClasses[variant],
        'border-primary rounded-[5px]',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      name='button'
    >
      {children}
    </button>
  );
};
export default CustomButton;
