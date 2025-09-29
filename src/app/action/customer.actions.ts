'use server';
import { verifyToken } from '@/lib/auth';
import { Prisma } from '@/lib/prisna';
import { ServiceError } from '@/lib/ServiceErrors';
import { AddCustomerForm } from '@/types/customer.types';
import type { IResponse } from '@/types/response.types';

export async function addCustomerAction(
  formData: AddCustomerForm
): Promise<IResponse<{ success: boolean; code: number; message: string }>> {
  try {
    const createdById = await verifyToken();

    console.log('addCustomerAction', formData);
    const { codeNumber, firstName, lastName, cardId, phone, carRegistration } =
      formData;
    await Prisma.customer.create({
      data: {
        codeNumber,
        firstName,
        lastName,
        cardId,
        phone,
        carRegistration,
        status: 'Active',
        createdBy: createdById,
      },
    });

    return {
      success: true,
      code: 200,
      message: 'Add Customer successful',
    };
  } catch (err: any) {
    console.error(err);

    if (err instanceof ServiceError) {
      return { success: false, code: err.code, message: err.message };
    }

    return {
      success: false,
      code: 500,
      message: err.message || 'Internal Server Error',
    };
  }
}
