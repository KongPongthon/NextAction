'use client';

import { cn } from '@/lib/utils';
import { ReactNode, useEffect, useState } from 'react';
import CustomButton from './CustomButton';

interface CustomConfirmDialogProps {
  open: boolean;
  children: ReactNode;
  cardClassName?: string;
  title: string;
  confirmText?: string;
  cancelText?: string;
  buttonContainerClassName?: string;
  isLoading?: boolean;
  disabled?: boolean;
  disabledConfirm?: boolean;
  disabledCancel?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ANIM_MS = 100; // ต้องตรงกับ duration-200

const CustomConfirmDialog = ({
  open = false,
  children,
  cardClassName,
  title,
  confirmText = 'ตกลง',
  cancelText = 'ยกเลิก',
  buttonContainerClassName,
  isLoading,
  disabled,
  disabledConfirm = false,
  disabledCancel = false,
  onConfirm,
  onClose,
}: CustomConfirmDialogProps) => {
  const [isMounted, setIsMounted] = useState(open);
  const [show, setShow] = useState(open);

  // คุม mount/unmount + play animation
  /*
  เพิ่มสถานะภายในไว้ควบคุม lifecycle สำหรับแอนิเมชัน
  - isMounted: คุมว่าเราจะ render dialog ไว้ไหม (เพื่อให้ปิดแบบเนียน)
  - show: คุมคลาสแอนิเมชัน (opacity/translate)
   */
  useEffect(() => {
    if (open) {
      setIsMounted(true);
      // requestAnimationFrame คือการบอก browser ว่า รอให้ browser ทำงาน cycle render + paint รอบแรกเสร็จก่อน (คือ DOM โผล่แบบ opacity-0 ไปแล้ว แล้วค่อย setShow(true) ในเฟรมถัดไป
      requestAnimationFrame(() => setShow(true));
    } else {
      setShow(false);
      const t = setTimeout(() => setIsMounted(false), ANIM_MS);
      return () => clearTimeout(t);
    }
  }, [open]);

  // ปิดด้วยปุ่ม Esc
  useEffect(() => {
    if (!isMounted) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMounted, onClose]);

  if (!isMounted) return null;

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='confirm-dialog-title'
      className={cn(
        'fixed inset-0 z-[50] grid place-items-center',
        // backdrop transition
        'bg-black/50 opacity-0 pointer-events-none transition-opacity duration-100',
        show && 'opacity-100 pointer-events-auto'
      )}
      // onClick={onClose} // คลิกนอกการ์ดเพื่อปิด
    >
      {/* Card */}
      <div
        className={cn(
          'bg-white min-h-[200px] min-w-[300px] max-w-[90vw] rounded-md p-4 md:p-8 shadow-lg mx-4',
          // card transition
          'transform transition-all duration-200',
          'opacity-0 translate-y-4 scale-95',
          show && 'opacity-100 translate-y-0 scale-100',
          cardClassName
        )}
        onClick={(e) => e.stopPropagation()} // กันคลิกทะลุ
      >
        <h5
          id='confirm-dialog-title'
          className='text-lg font-semibold tracking-wide text-gray-700'
        >
          {title}
        </h5>

        <div className='mt-6 md:mt-8'>{children}</div>

        <div
          className={cn(
            'flex justify-center gap-4 mt-8',
            buttonContainerClassName
          )}
        >
          {disabledCancel ? null : (
            <CustomButton
              variant='outline'
              onClick={onClose}
              disabled={disabled}
            >
              {cancelText}
            </CustomButton>
          )}
          {disabledConfirm ? null : (
            <CustomButton onClick={onConfirm} disabled={disabled || isLoading}>
              {isLoading ? <div>Loading...</div> : confirmText}
            </CustomButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomConfirmDialog;
