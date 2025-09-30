import { getLineWeighingAction } from '@/app/action/lineWeighing.actions';
import LineWeighing from './_component/LineWeighing';
import { ILineWeighingTable } from '@/types/lineWeighing.types';

const page = async () => {
  const data = await getLineWeighingAction();
  return <LineWeighing data={data.data as ILineWeighingTable[]} />;
};
export default page;
