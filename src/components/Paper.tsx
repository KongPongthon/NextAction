import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PaperProps {
  children?: ReactNode;
  className?: string;
}

const Paper: React.FC<PaperProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'p-2 md:p-6 lg:p-8 h-fit md:m-1 lg:m-6 rounded-md bg-white ',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Paper;
