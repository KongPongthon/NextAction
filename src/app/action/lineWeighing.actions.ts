'use server';
import { verifyToken } from '@/lib/auth';
import { Prisma } from '@/lib/prisna';
import { ServiceError } from '@/lib/ServiceErrors';
import {
  AddLineWeighingForm,
  ILineWeighingTable,
} from '@/types/lineWeighing.types';
import { IResponse } from '@/types/response.types';

const addLineWeighingAction = async (
  formData: AddLineWeighingForm
): Promise<IResponse<{ success: boolean; code: number; message: string }>> => {
  try {
    const createdById = await verifyToken();

    console.log('addLineWeighingAction', formData);
    const {
      lineType,
      inputWeight,
      weightOut,
      deductWeight,
      averagePrice,
      description,
    } = formData;

    //   id           String @id @default(uuid())
    //   inputWeight  Float
    //   weightOut    Float
    //   netWeight    Float
    //   deductWeight Float
    //   totalMoney   Float
    //   averagePrice Float
    //   lineType     Line
    //   description  String
    const totalWeight = weightOut + deductWeight;
    const netWeight = inputWeight - totalWeight;
    const totalMoney = netWeight * averagePrice;

    const lineWeighing = await Prisma.lineWeighing.create({
      data: {
        lineType: lineType === 'in' ? 'In' : 'Out',
        inputWeight,
        weightOut,
        deductWeight,
        averagePrice,
        description,
        createdBy: createdById,
        netWeight,
        totalMoney,
        status: 'Active',
      },
    });

    console.log('lineWeighing', lineWeighing);

    return {
      success: true,
      code: 200,
      message: 'Add Line Weighing successful',
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

const getLineWeighingAction = async (): Promise<
  IResponse<ILineWeighingTable[]>
> => {
  try {
    // id: string;
    // lineType: string;
    // description: string;
    // inputWeight: number;
    // //น้ำหนักรถ
    // weightOut: number;
    // netWeight: number;
    // //หักน้ำหนักน้ำ
    // deductWeight: number;
    // totalMoney: number;
    // averagePrice: number;

    const lineWeighing = await Prisma.$queryRaw`
    SELECT 
      id,
      CASE 
        WHEN "lineType" = 'In' THEN 'รถเข้า' 
        ELSE 'รถออก' 
      END as "lineType",
      "inputWeight",
      "weightOut",
      "netWeight",
      "deductWeight",
      "averagePrice",
      "totalMoney"
    FROM "LineWeighing"
    WHERE "status" = 'Active';
  `;

    return {
      success: true,
      code: 200,
      data: lineWeighing as ILineWeighingTable[],
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

export { addLineWeighingAction, getLineWeighingAction };
