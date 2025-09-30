import z from 'zod/v3';

// types main
export interface ICustomer {
  id: string;
  codeNumber: number;
  firstName: string;
  lastName: string;
  cardId: number;
  phone: number;
  carRegistration: string;
}

//types Table
export type ICustomerTable = Omit<
  ICustomer,
  'cardId' | 'firstName' | 'lastName'
> & {
  fullName: string;
};

// ✅ สร้าง Zod schema
export const AddCustomerSchema = z.object({
  codeNumber: z.number().min(1, { message: 'กรุณากรอกเลขรหัสลูกค้า' }),
  firstName: z.string().min(1, { message: 'กรุณากรอกชื่อ' }),
  lastName: z.string().min(1, { message: 'กรุณากรอกนามสกุล' }),
  cardId: z.number().min(1, { message: 'กรุณากรอกเลขบัตรประชาชน' }),
  phone: z.number().min(1, { message: 'กรุณากรอกเบอร์โทรศัพท์' }),
  carRegistration: z.string().min(1, { message: 'กรุณากรอกทะเบียนรถ' }),
  id: z.string(),
});

// ✅ สร้าง type จาก schema
export type AddCustomerForm = z.infer<typeof AddCustomerSchema>;

// ✅ ค่า default
export const initialFormData: AddCustomerForm = {
  codeNumber: 0,
  firstName: '',
  lastName: '',
  cardId: 0,
  phone: 0,
  carRegistration: '',
  id: '',
};
