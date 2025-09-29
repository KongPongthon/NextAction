'use client';
import { useState } from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CustomButton from '../CustomButton';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='bg-white shadow-md fixed top-0 left-0 w-full z-50'>
      <div className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between'>
        {/* Logo */}
        <div className='flex items-center space-x-2'>
          {/* <img src='/logo.png' alt='Logo' className='h-8 w-8 object-contain' /> */}
          <span className='font-bold text-xl'>MyApp</span>
        </div>

        {/* Menu Desktop */}
        <div className='hidden md:flex space-x-6'>
          <Link
            href='/admin/dashboard'
            className='hover:text-blue-600 transition-colors'
          >
            Home
          </Link>
          <Link
            href='/admin/customer'
            className='hover:text-blue-600 transition-colors'
          >
            Customer
          </Link>
          <Link
            href='/admin/lineweighing'
            className='hover:text-blue-600 transition-colors'
          >
            LineWeighing
          </Link>
        </div>
        {/* Profile Dropdown */}
        <div className='hidden md:flex space-x-6'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className='focus-visible:ring-ring/0'>
              <Button
                variant='ghost'
                className='rounded-full p-1 hover:bg-transparent'
              >
                {/* <img
                  src='/profile.jpg'
                  alt='Profile'
                  className='w-9 h-9 rounded-full border'
                /> */}
                <Avatar className='w-9 h-9'>
                  <AvatarImage src='/profile.jpg' alt='Profile' />
                  <AvatarFallback>PM</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-40'>
              <DropdownMenuItem>
                <User className='mr-2 h-4 w-4' />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='text-red-600'>
                <LogOut className='mr-2 h-4 w-4' />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button */}
        <button className='md:hidden p-2' onClick={() => setIsOpen(!isOpen)}>
          <Menu />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='md:hidden bg-white border-t shadow-sm block px-4 py-2'>
          <div className='block px-4 py-2'>
            {/* <img
              src='/profile.jpg'
              alt='Profile'
              className='w-9 h-9 rounded-full border'
            /> */}
            <Avatar className='w-9 h-9'>
              <AvatarImage src='/profile.jpg' alt='Profile' />
              <AvatarFallback>PM</AvatarFallback>
            </Avatar>
          </div>
          <Link
            href='/admin/dashboard'
            className='block px-4 py-2 hover:underline'
          >
            Home
          </Link>
          <Link
            href='/admin/customer'
            className='block px-4 py-2 hover:underline'
          >
            Customer
          </Link>
          <Link
            href='/admin/lineweighingin'
            className='block px-4 py-2 hover:underline'
          >
            LineWeighing
          </Link>
          <div>
            <CustomButton
              variant='outline'
              className='w-full flex items-center justify-center'
            >
              <LogOut />
              Logout
            </CustomButton>
          </div>
        </div>
      )}
    </nav>
  );
}
