import React from 'react';
import CustomConfirmDialog from '@/components/CustomConfirmDialog';
import CustomInput from '@/components/CustomInput/CustomInput';
import { AddCustomerForm, ICustomer } from '@/types/customer.types';
import {
  FieldErrors,
  UseFormRegister,
  UseFormReset,
  useForm,
} from 'react-hook-form';
import { getCustomerByIdAction } from '@/app/action/customer.actions';

interface dialogProps {
  open: boolean;
  onClose: () => void;
  //   onSubmit: (formData: AddCustomerForm) => void;
  register: UseFormRegister<AddCustomerForm>;
  //   errors: FieldErrors<AddCustomerForm>;
  //   handleSubmit: ReturnType<typeof useForm>['handleSubmit'];
  id: string;
  reset: UseFormReset<AddCustomerForm>;
}

const ViewDialog = ({
  open,
  onClose,
  //   onSubmit,
  register,
  //   errors,
  //   handleSubmit,
  id,
  reset,
}: dialogProps) => {
  const onCancel = () => {
    onClose();
    console.log('Cancel');
  };

  React.useEffect(() => {
    if (id && open) {
      getCustomer();
    }
  }, [id, open]);

  const getCustomer = async () => {
    const res = await getCustomerByIdAction(id);
    console.log('GetData', res);
    if (res && res?.success) {
      const customer = res.data as ICustomer; // Type guard
      reset({
        codeNumber: customer.codeNumber,
        firstName: customer.firstName,
        lastName: customer.lastName,
        cardId: customer.cardId,
        phone: customer.phone,
        carRegistration: customer.carRegistration,
        id: customer.id,
      });
    }
  };

  return (
    <CustomConfirmDialog
      open={open}
      onClose={onCancel}
      // onConfirm={handleSubmit(onSubmit)}
      onConfirm={() => {}}
      disabledConfirm={true}
      title={'Add Customer'}
    >
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <CustomInput
          label='Code Number'
          type='number'
          //   error={errors.codeNumber?.message}
          {...register('codeNumber', { valueAsNumber: true })}
          disabled={true}
        />
        <CustomInput
          label='First Name'
          //   error={errors.firstName?.message}
          {...register('firstName')}
          disabled={true}
        />
        <CustomInput
          label='Last Name'
          //   error={errors.lastName?.message}
          {...register('lastName')}
          disabled={true}
        />
        <CustomInput
          label='Card Id'
          type='number'
          //   error={errors.cardId?.message}
          {...register('cardId', { valueAsNumber: true })}
          disabled={true}
        />
        <CustomInput
          label='Phone'
          type='number'
          //   error={errors.phone?.message}
          {...register('phone', { valueAsNumber: true })}
          disabled={true}
        />
        <CustomInput
          label='Car Registration'
          //   error={errors.carRegistration?.message}
          {...register('carRegistration')}
          disabled={true}
        />
      </div>
    </CustomConfirmDialog>
  );
};

export default ViewDialog;
