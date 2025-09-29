// types main
export interface ICustomer {
  _id: string;
  codeNumber: number;
  perfix: string;
  firstName: string;
  lastName: string;
  cardId: number;
  phone: number;
  carRegistration: string;
}

//types Table
export type ICustomerTable = Omit<
  ICustomer,
  'cardId' | 'perfix' | 'firstName' | 'lastName'
> & {
  fullName: string;
};
