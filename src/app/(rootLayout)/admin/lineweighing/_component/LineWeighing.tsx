'use client';
import CustomButton from '@/components/CustomButton';
import { CustomTable, TableColumn } from '@/components/CustomTable';
import HeaderTitleContainer from '@/components/HeaderTitleContainer';
import Paper from '@/components/Paper';
import { useSetQuery } from '@/hook/useSetQuery';
import {
  AddLineWeighingForm,
  AddLineWeighingSchema,
  ILineWeighingTable,
  initialFormData,
} from '@/types/lineWeighing.types';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import AddDialog from '../_diglog/addDialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addLineWeighingAction } from '@/app/action/lineWeighing.actions';
import { handleServiceResponse } from '@/utils/handleServiceResponse';
import { IResponseError } from '@/types/response.types';

const LineWeighing = ({ data }: { data: ILineWeighingTable[] }) => {
  const setQuery = useSetQuery();
  const searchParams = useSearchParams();
  const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1); // min 1
  const limit = Math.max(parseInt(searchParams.get('limit') || '10', 10), 1);
  const onPageChange = (clientPageIndexZeroBased: number) => {
    const nextPage = clientPageIndexZeroBased + 1; // url = 1-based
    setQuery({ page: nextPage });
  };

  const onRowsPerPageChange = (nextLimit: number) => {
    setQuery({ limit: nextLimit, page: page }, { replace: true });
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AddLineWeighingForm>({
    resolver: zodResolver(AddLineWeighingSchema), // ✅ ใช้ schema
    mode: 'onChange',
    defaultValues: initialFormData,
  });

  const [isOpenAddDialog, setIsOpenAddDialog] = React.useState(false);

  const columns: TableColumn<ILineWeighingTable>[] = [
    {
      key: 'lineType',
      name: 'เข้า - ออก',
    },
    {
      key: 'inputWeight',
      name: 'น้ำหนักเข้า',
    },
    {
      key: 'weightOut',
      name: 'น้ำหนักออก',
    },
    {
      key: 'deductWeight',
      name: 'หักน้ำหนัก',
    },
    {
      key: 'netWeight',
      name: 'น้ำหนักสุทธิ',
    },
    {
      key: 'averagePrice',
      name: 'ราคาเฉลี่ย / กิโลกรัม',
    },
    {
      key: 'totalMoney',
      name: 'ราคา',
    },
    {
      key: 'id',
      name: 'จัดการ',
      type: 'rowActions',
    },
  ];

  console.log('testData', data);

  const onSubmit = async (data: AddLineWeighingForm) => {
    console.log(data);
    try {
      const res = await addLineWeighingAction(data);

      const ok = handleServiceResponse(res as IResponseError);
      if (!ok) return;
    } catch (err) {
      console.error(err);
    }
  };

  const openAddDialog = () => setIsOpenAddDialog(!isOpenAddDialog);
  return (
    <div>
      <HeaderTitleContainer>
        <div>การชั่งน้ําหนัก</div>
        <div className='md:flex justify-end py-3'>
          <CustomButton
            className='w-full md:max-w-[50px]'
            onClick={openAddDialog}
          >
            +ADD
          </CustomButton>
        </div>
      </HeaderTitleContainer>
      <Paper>
        <CustomTable
          data={data || []}
          columns={columns || []}
          page={page - 1}
          rowsPerPage={limit}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          actions={[]}
        />
      </Paper>
      <AddDialog
        open={isOpenAddDialog}
        onClose={openAddDialog}
        onSubmit={onSubmit}
        control={control}
        register={register}
        errors={errors}
        handleSubmit={handleSubmit}
        reset={reset}
      />
    </div>
  );
};
export default LineWeighing;
