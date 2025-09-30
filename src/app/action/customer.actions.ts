'use server';
import { verifyToken } from '@/lib/auth';
import { Prisma } from '@/lib/prisna';
import { ServiceError } from '@/lib/ServiceErrors';
import {
  AddCustomerForm,
  ICustomer,
  ICustomerTable,
} from '@/types/customer.types';
import type { IResponse } from '@/types/response.types';

const addCustomerAction = async (
  formData: AddCustomerForm
): Promise<IResponse<{ success: boolean; code: number; message: string }>> => {
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
};

const getCustomerAction = async (): Promise<IResponse<ICustomerTable[]>> => {
  try {
    const customers = await Prisma.$queryRaw`
      SELECT 
        id,
        "codeNumber",
        CONCAT("firstName", ' ', "lastName") as "fullName",
        phone,
        "carRegistration"
      FROM "Customer"
      WHERE "status" = 'Active'
    `;
    console.log('getCustomerAction', customers);

    return { success: true, code: 200, data: customers as ICustomerTable[] };
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
};

const getCustomerByIdAction = async (
  id: string
): Promise<IResponse<ICustomer>> => {
  try {
    const customer = await Prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        codeNumber: true,
        firstName: true,
        lastName: true,
        cardId: true,
        phone: true,
        carRegistration: true,
      },
    });
    return { success: true, code: 200, data: customer as ICustomer };
  } catch (err: any) {
    if (err instanceof ServiceError) {
      return { success: false, code: err.code, message: err.message };
    }
    return {
      success: false,
      code: 500,
      message: err.message || 'Internal Server Error',
    };
  }
};

const updateCustomerAction = async (
  formData: AddCustomerForm
): Promise<IResponse<{ success: boolean; code: number; message: string }>> => {
  try {
    console.log('updateCustomerAction', formData);

    const {
      id,
      codeNumber,
      firstName,
      lastName,
      cardId,
      phone,
      carRegistration,
    } = formData;

    await Prisma.customer.update({
      where: { id },
      data: {
        codeNumber,
        firstName,
        lastName,
        cardId,
        phone,
        carRegistration,
      },
    });
    return {
      success: true,
      code: 200,
      message: 'Update Customer successful',
    };
  } catch (err: any) {
    if (err instanceof ServiceError) {
      return { success: false, code: err.code, message: err.message };
    }
    return {
      success: false,
      code: 500,
      message: err.message || 'Internal Server Error',
    };
  }
};

const deleteCustomerAction = async (
  id: string
): Promise<IResponse<{ success: boolean; code: number; message: string }>> => {
  try {
    console.log('deleteCustomerAction', id);
    await Prisma.customer.update({
      where: { id },
      data: {
        status: 'Inactive',
      },
    });
    return {
      success: true,
      code: 200,
      message: 'Delete Customer successful',
    };
  } catch (error: any) {
    if (error instanceof ServiceError) {
      return { success: false, code: error.code, message: error.message };
    }
    return {
      success: false,
      code: 500,
      message: error.message || 'Internal Server Error',
    };
  }
};

export {
  addCustomerAction,
  getCustomerAction,
  getCustomerByIdAction,
  updateCustomerAction,
  deleteCustomerAction,
};
