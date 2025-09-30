import { getCustomerAction } from '@/app/action/customer.actions';
import Customer from './_component/Customer';
import { ICustomerTable } from '@/types/customer.types';

const page = async () => {
  const data = await getCustomerAction();
  console.log('data', data);
  return <Customer data={data.data as ICustomerTable[]} />;
};
export default page;
