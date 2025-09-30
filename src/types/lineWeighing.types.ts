import z from 'zod/v3';

// Define the LineWeighing type
export interface ILineWeighing {
  id: string;
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
}

export type ILineWeighingTable = Omit<
  ILineWeighing,
  'createdBy' | 'description'
>;

// ✅ สร้าง Zod schema
export const AddLineWeighingSchema = z.object({
  id: z.string(),
  lineType: z.string().min(1, { message: 'กรุณากรอกประเภท' }),
  inputWeight: z.number().min(1, { message: 'กรุณากรอกน้ำหนักเข้า' }),
  weightOut: z.number().min(1, { message: 'กรุณากรอกน้ำหนักออก' }),
  deductWeight: z.number().min(1, { message: 'กรุณากรอกหักน้ำหนักน้ำ' }),
  averagePrice: z.number().min(1, { message: 'กรุณากรอกราคาเฉลี่ย' }),
  description: z.string(),
});

// ✅ สร้าง type จาก schema
export type AddLineWeighingForm = z.infer<typeof AddLineWeighingSchema>;

export const initialFormData: AddLineWeighingForm = {
  id: '',
  lineType: '',
  inputWeight: 0,
  weightOut: 0,
  deductWeight: 0,
  averagePrice: 0,
  description: '',
};
