// Define the LineWeighing type
export interface ILineWeighing {
  _id: string;
  lineType: string;
  listWeighing: string;
  inputWeight: number;
  weightOut: number;
  netWeight: number;
  deductWeight: number;
  money: number;
  deductMoney: number;
  totalMoney: number;
  averagePrice: number;
  createdBy: string;
}

export type ILineWeighingTable = Omit<
  ILineWeighing,
  'createdBy' | 'deductMoney' | 'money' | 'listWeighing'
>;
