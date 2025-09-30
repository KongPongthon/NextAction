'use client';
import CustomButton from '@/components/CustomButton';
import { CustomTable, TableColumn } from '@/components/CustomTable';
import HeaderTitleContainer from '@/components/HeaderTitleContainer';
import Paper from '@/components/Paper';
import { useSetQuery } from '@/hook/useSetQuery';
import {
  AddCustomerSchema,
  initialFormData,
  type AddCustomerForm,
  type ICustomerTable,
} from '@/types/customer.types';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import Dialog from '../_dialog/addDialog';
import {
  addCustomerAction,
  deleteCustomerAction,
  updateCustomerAction,
} from '@/app/action/customer.actions';
import { handleServiceResponse } from '@/utils/handleServiceResponse';
import { IResponseError } from '@/types/response.types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import EditDialog from '../_dialog/editDialog';
import CustomConfirmDialog from '@/components/CustomConfirmDialog';
import ViewDialog from '../_dialog/viewDialog';

const Customer = ({ data }: { data: ICustomerTable[] }) => {
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
    formState: { errors },
  } = useForm<AddCustomerForm>({
    resolver: zodResolver(AddCustomerSchema), // ✅ ใช้ schema
    mode: 'onChange',
    defaultValues: initialFormData,
  });

  const [isOpenDialog, setIsOpenDialog] = React.useState(false);
  const [isOpenEditDialog, setIsOpenEditDialog] = React.useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = React.useState(false);
  const [isOpenViewDialog, setIsOpenViewDialog] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<ICustomerTable>();
  const router = useRouter();
  const columns: TableColumn<ICustomerTable>[] = [
    {
      key: 'codeNumber',
      name: 'รหัสชาวสวน',
    },
    {
      key: 'fullName',
      name: 'ชื่อ - นามสกุล',
    },
    {
      key: 'phone',
      name: 'เบอร์โทรศัพท์',
    },
    {
      key: 'carRegistration',
      name: 'ทะเบียนรถ',
    },
    {
      key: 'id',
      name: 'จัดการ',
      type: 'dropdownActions',
    },
  ];

  const getActions = () => {
    const actions = [];
    actions.push(
      {
        name: 'แก้ไขข้อมูล',
        onClick: async (item: ICustomerTable) => {
          setSelectedItem(item);
          openEditDialog();
        },
      },
      {
        name: 'ลบข้อมูล',
        onClick: (item: ICustomerTable) => {
          setSelectedItem(item);
          openDeleteDialog();
        },
      },
      {
        name: 'ดูข้อมูล',
        onClick: async (item: ICustomerTable) => {
          setSelectedItem(item);
          openViewDialog();
        },
      }
    );
    return actions;
  };

  const onSubmit = async (formData: AddCustomerForm) => {
    const res = await addCustomerAction(formData);

    const ok = handleServiceResponse(res as IResponseError);
    if (!ok) return; // มี error → หยุด

    console.log('Add success', res.message);
    openAddDialog();
    reset();
    router.refresh();
  };

  const onSubmitEdit = async (formData: AddCustomerForm) => {
    console.log('formData', formData);
    const res = await updateCustomerAction(formData);
    const ok = handleServiceResponse(res as IResponseError);
    if (!ok) return; // มี error → หยุด

    console.log('Update success', res.message);
    openEditDialog();
    reset();
    router.refresh();
  };

  const onSubmitDelete = async (id: string) => {
    console.log('id', id);
    const res = await deleteCustomerAction(id);
    const ok = handleServiceResponse(res as IResponseError);
    if (!ok) return; // มี error → หยุด

    console.log('Delete success', res.message);
    openDeleteDialog();
    reset();
    router.refresh();
  };

  const openAddDialog = () => setIsOpenDialog(!isOpenDialog);
  const openEditDialog = () => setIsOpenEditDialog(!isOpenEditDialog);
  const openDeleteDialog = () => setIsOpenDeleteDialog(!isOpenDeleteDialog);
  const openViewDialog = () => setIsOpenViewDialog(!isOpenViewDialog);
  return (
    <div>
      <HeaderTitleContainer>
        <div>ข้อมูลลูกค้า</div>
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
          actions={getActions()}
        />
      </Paper>
      <Dialog
        open={isOpenDialog}
        onClose={openAddDialog}
        onSubmit={onSubmit}
        register={register}
        errors={errors}
        handleSubmit={handleSubmit}
      />
      <EditDialog
        open={isOpenEditDialog}
        onClose={openEditDialog}
        onSubmit={onSubmitEdit}
        register={register}
        errors={errors}
        handleSubmit={handleSubmit}
        id={selectedItem?.id || ''}
        reset={reset}
      />
      <ViewDialog
        open={isOpenViewDialog}
        onClose={openViewDialog}
        // onSubmit={onSubmitDelete}
        register={register}
        // errors={errors}
        id={selectedItem?.id || ''}
        reset={reset}
      />
      <CustomConfirmDialog
        open={isOpenDeleteDialog}
        onClose={openDeleteDialog}
        onConfirm={() => onSubmitDelete(selectedItem?.id || '')}
        title={'ลบข้อมูล'}
      >
        <div>
          คุณยืนยันที่จะลบข้อมูลของ {selectedItem?.fullName} ใช่หรือไม่?
        </div>
      </CustomConfirmDialog>
    </div>
  );
};
export default Customer;
