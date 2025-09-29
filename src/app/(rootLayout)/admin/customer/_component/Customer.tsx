'use client';
import CustomButton from '@/components/CustomButton';
import { CustomTable, TableColumn } from '@/components/CustomTable';
import HeaderTitleContainer from '@/components/HeaderTitleContainer';
import Paper from '@/components/Paper';
import { useSetQuery } from '@/hook/useSetQuery';
import type { ICustomerTable } from '@/types/customer.types';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import Dialog from '../_dialog/addDialog';

const Customer = () => {
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

  const [openDialog, setOpenDialog] = React.useState(false);
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
      key: '_id',
      name: 'จัดการ',
      type: 'rowActions',
    },
  ];
  const data = [
    {
      _id: '1',
      codeNumber: 1,
      fullName: 'Mr.Test One',
      phone: 1234567890,
      carRegistration: 'FG1545',
    },
  ];

  const openAddDialog = () => setOpenDialog(!openDialog);
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
          actions={[]}
        />
      </Paper>
      <Dialog open={openDialog} onClose={openAddDialog} />
      {/* <DialogEdit open={isOpenEdit} onClose={openEditDialog} data='' /> */}
    </div>
  );
};
export default Customer;
