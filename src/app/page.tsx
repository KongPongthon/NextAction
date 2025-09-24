import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const page = () => {
  return (
    <main>
      <header className=' border-b-2'>
        <div className='px-3 lg:px-[5rem] xl:px-[20rem] flex justify-center items-center p-5'>
          <div className='flex justify-between w-full items-center'>
            <div className=''>P Hotel</div>
            <div className='flex justify-center items-center gap-4'>
              <div className='hover:bg-gray-50 px-5 py-2 rounded-md'>Login</div>
            </div>
          </div>
        </div>
      </header>
      <section className='pt-5 h-full w-full px-3 lg:px-[5rem] xl:px-[20rem]'>
        <div className='bg-red-600 w-full h-full'>
          <div className='w-full h-full grid grid-cols-5 shadow-xl border-gray-400'>
            <div className=' bg-amber-800 col-span-2'>s</div>
            <div>a</div>
            <div className='col-span-2'>s</div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default page;
