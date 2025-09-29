import { Prisma } from './prisna';

/* example
    await updateWithHistory(
        "lineWeighingIn",          // model หลัก
        "lineWeighingInHistory",   // model ประวัติ
        "id",                      // primary key field
        "line-id-xxx",             // primary key value
        {
            inputWeight: 120,
            netWeight: 115,
            money: 2500,
        },
        "user-id-123"              // updatedBy
    );
/*

/**
 * Generic update with history log (delta)
 */
export async function updateWithHistory(
  prismaModel: keyof typeof Prisma, // เช่น "lineWeighingIn"
  historyModel: keyof typeof Prisma, // เช่น "lineWeighingInHistory"
  idField: string, // เช่น "id"
  idValue: string, // primary key value
  newData: Record<string, any>, // ข้อมูลใหม่
  userId: string // updatedBy
) {
  return Prisma.$transaction(async (tx) => {
    // model หลัก
    // @ts-ignore
    const model = tx[prismaModel];
    // history model
    // @ts-ignore
    const history = tx[historyModel];

    // 1. ดึงข้อมูลเก่า
    const old = await model.findUnique({
      where: { [idField]: idValue },
    });
    if (!old) throw new Error(`${String(prismaModel)} not found`);

    // 2. update
    const updated = await model.update({
      where: { [idField]: idValue },
      data: newData,
    });

    // 3. diff หา field ที่เปลี่ยน
    const changedFields = Object.keys(newData).filter(
      (key) => (old as any)[key] !== (newData as any)[key]
    );

    // 4. เก็บ log
    if (changedFields.length > 0) {
      const historyLogs = changedFields.map((field) => ({
        // foreign key ต้องตรงกับ schema เช่น lineWeighingInId, customerId
        [`${prismaModel as string}Id`]: updated[idField],
        updatedBy: userId,
        fieldName: field,
        oldValue: old[field as keyof typeof old]?.toString() ?? null,
        newValue: updated[field as keyof typeof updated]?.toString() ?? null,
      }));

      await history.createMany({ data: historyLogs });
    }

    return updated;
  });
}
