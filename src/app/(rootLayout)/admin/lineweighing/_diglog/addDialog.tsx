import CustomConfirmDialog from '@/components/CustomConfirmDialog';
import CustomInput from '@/components/CustomInput/CustomInput';
import CustomSelect from '@/components/CustomInput/CustomSelect';
import CustomTextField from '@/components/CustomInput/CustomTextField';
import { AddLineWeighingForm } from '@/types/lineWeighing.types';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormReset,
  useForm,
} from 'react-hook-form';

interface dialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: AddLineWeighingForm) => void;
  register: UseFormRegister<AddLineWeighingForm>;
  errors: FieldErrors<AddLineWeighingForm>;
  control: Control<AddLineWeighingForm>;
  handleSubmit: ReturnType<typeof useForm>['handleSubmit'];
  reset: UseFormReset<AddLineWeighingForm>;
}

const AddDialog = ({
  open,
  onClose,
  onSubmit,
  register,
  errors,
  control,
  handleSubmit,
  reset,
}: dialogProps) => {
  const onCancel = () => {
    onClose();
    reset();
    console.log('Cancel');
  };
  return (
    <CustomConfirmDialog
      open={open}
      onClose={onCancel}
      // onConfirm={handleSubmit(onSubmit)}
      onConfirm={() =>
        handleSubmit(
          (data) => onSubmit(data as AddLineWeighingForm),
          (err) => console.log('❌ Validation errors:', err)
        )()
      }
      title={'Add Customer'}
    >
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Controller
          name='lineType'
          control={control}
          render={({ field, fieldState }) => (
            <CustomSelect
              name={field.name}
              label='ประเภทรถ'
              options={[
                { label: 'รถเข้า', value: 'in' },
                { label: 'รถออก', value: 'out' },
              ]}
              value={field.value}
              onChange={(d) => {
                field.onChange(d.value); // เซ็ตค่า matter ปกติ
                // setValue('clientName', d.optionName || ''); // อัปเดต clientName เพิ่มเติม
              }}
              onClear={() => {
                field.onChange('');
                // setValue('clientName', ''); // เคลียร์ clientName ด้วย
              }}
              required
              error={fieldState.error?.message}
            />
          )}
        />
        <CustomInput
          label='น้ำหนักเข้า'
          type='number'
          required
          error={errors.inputWeight?.message}
          {...register('inputWeight', { valueAsNumber: true })}
        />
        <CustomInput
          label='น้ำหนักออก'
          type='number'
          required
          error={errors.weightOut?.message}
          {...register('weightOut', { valueAsNumber: true })}
        />
        <CustomInput
          label='หักน้ำหนัก'
          type='number'
          required
          error={errors.deductWeight?.message}
          {...register('deductWeight', { valueAsNumber: true })}
        />
        <CustomInput
          label='ราคาต่อกิโลกรัม'
          type='number'
          required
          error={errors.averagePrice?.message}
          {...register('averagePrice', { valueAsNumber: true })}
        />
        <CustomTextField
          // name='internalcomment'
          {...register('description')}
          label='หมายเหตุ'
          containerClassName='md:col-span-3'
          textFieldClassName='resize-none'
        />
      </div>
    </CustomConfirmDialog>
  );
};
export default AddDialog;
