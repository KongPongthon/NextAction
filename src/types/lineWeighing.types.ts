// Define the LineWeighing type
export interface ILineWeighing {
  _id: string;
  lineType: string;
  description: string;
  inputWeight: number;
  //น้ำหนักรถ
  weightOut: number;
  netWeight: number;
  //หักน้ำหนักน้ำ
  deductWeight: number;
  totalMoney: number;
  averagePrice: number;
  createdBy: string;
}

export type ILineWeighingTable = Omit<
  ILineWeighing,
  'createdBy' | 'description'
>;
