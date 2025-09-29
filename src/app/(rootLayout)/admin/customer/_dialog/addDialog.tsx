'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomConfirmDialog from '@/components/CustomConfirmDialog';
import CustomInput from '@/components/CustomInput/CustomInput';
import { addCustomerAction } from '@/app/action/customer.actions';
import {
  AddCustomerForm,
  AddCustomerSchema,
  initialFormData,
} from '@/types/customer.types';
import { useRouter } from 'next/navigation';
import { handleServiceResponse } from '@/utils/handleServiceResponse';

interface dialogProps {
  open: boolean;
  onClose: () => void;
  // data: string;
  // disabled?: boolean;
  // textClose?: string;
  // textSubmit?: string;
}

const Dialog = ({ open, onClose }: dialogProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCustomerForm>({
    resolver: zodResolver(AddCustomerSchema), // ✅ ใช้ schema
    mode: 'onChange',
    defaultValues: initialFormData,
  });

  const onSubmit = async (formData: AddCustomerForm) => {
    const res = await addCustomerAction(formData);

    const ok = handleServiceResponse(res);
    if (!ok) return; // มี error → หยุด

    console.log('Add success', res.message);
    onCancel();
  };

  const onCancel = () => {
    reset();
    onClose();
    console.log('Cancel');
  };

  return (
    <CustomConfirmDialog
      open={open}
      onClose={onCancel}
      // onConfirm={handleSubmit(onSubmit)}
      onConfirm={() =>
        handleSubmit(
          (data) => onSubmit(data),
          (err) => console.log('❌ Validation errors:', err)
        )()
      }
      title={'Add Customer'}
    >
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <CustomInput
          label='Code Number'
          type='number'
          required
          error={errors.codeNumber?.message}
          {...register('codeNumber', { valueAsNumber: true })}
        />
        <CustomInput
          label='First Name'
          required
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <CustomInput
          label='Last Name'
          required
          error={errors.lastName?.message}
          {...register('lastName')}
        />
        <CustomInput
          label='Card Id'
          type='number'
          required
          error={errors.cardId?.message}
          {...register('cardId', { valueAsNumber: true })}
        />
        <CustomInput
          label='Phone'
          type='number'
          required
          error={errors.phone?.message}
          {...register('phone', { valueAsNumber: true })}
        />
        <CustomInput
          label='Car Registration'
          required
          error={errors.carRegistration?.message}
          {...register('carRegistration')}
        />
      </div>
    </CustomConfirmDialog>
  );
};

export default Dialog;
