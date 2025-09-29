'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CustomConfirmDialog from '@/components/CustomConfirmDialog';
import CustomInput from '@/components/CustomInput/CustomInput';

interface dialogProps {
  open: boolean;
  onClose: () => void;
  // data: string;
  // disabled?: boolean;
  // textClose?: string;
  // textSubmit?: string;
}

// ✅ สร้าง Zod schema
const AddCustomerSchema = z.object({
  codeNumber: z.number().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  cardId: z.number().min(1),
  document: z.string().min(1),
  valueXY: z.string().min(1),
  address: z.string().min(1),
  phone: z.number().min(1),
});

// ✅ สร้าง type จาก schema
type AddCustomerForm = z.infer<typeof AddCustomerSchema>;

// ✅ ค่า default
const initialFormData: AddCustomerForm = {
  codeNumber: 0,
  firstName: '',
  lastName: '',
  address: '',
  cardId: 0,
  document: '',
  valueXY: '',
  phone: 0,
};

const Dialog = ({ open, onClose }: dialogProps) => {
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
    console.log('Submit', formData);
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
          label='Address'
          required
          error={errors.address?.message}
          {...register('address')}
        />

        <CustomInput
          label='Document'
          required
          error={errors.document?.message}
          {...register('document')}
        />
        <CustomInput
          label='ValueXY'
          required
          error={errors.valueXY?.message}
          {...register('valueXY')}
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
      </div>
    </CustomConfirmDialog>
  );
};

export default Dialog;
