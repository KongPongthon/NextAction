'use client';
import CustomButton from '@/components/CustomButton';
import { CustomTable, TableColumn } from '@/components/CustomTable';
import HeaderTitleContainer from '@/components/HeaderTitleContainer';
import Paper from '@/components/Paper';
import { useSetQuery } from '@/hook/useSetQuery';
import { ILineWeighingTable } from '@/types/lineWeighing.types';
import { useSearchParams } from 'next/navigation';

const LineWeighing = () => {
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
      key: '_id',
      name: 'จัดการ',
      type: 'rowActions',
    },
  ];
  const data = [
    {
      _id: '1',
      lineType: 'เข้า',
      inputWeight: 5000,
      weightOut: 1500,
      netWeight: 3460,
      deductWeight: 40,
      averagePrice: 2,
      totalMoney: 6920,
    },
  ];
  return (
    <div>
      <HeaderTitleContainer>
        <div>การชั่งน้ําหนัก</div>
        <div className='md:flex justify-end py-3'>
          <CustomButton
            className='w-full md:max-w-[50px]'
            // onClick={openAddDialog}
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
    </div>
  );
};
export default LineWeighing;
