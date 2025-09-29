import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

const HeaderTitleContainer = ({
  children,
  containerClassname,
}: {
  children: ReactNode;
  containerClassname?: string;
}) => {
  return (
    <div className={cn('px-2 md:px-6 lg:px-8 mt-4', containerClassname)}>
      {children}
    </div>
  );
};
export default HeaderTitleContainer;
