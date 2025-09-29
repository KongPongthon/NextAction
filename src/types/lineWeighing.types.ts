// Define the LineWeighing type
export interface ILineWeighingTable {
  _id: string;
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
