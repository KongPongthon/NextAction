-- CreateEnum
CREATE TYPE "public"."Prefix" AS ENUM ('Mr', 'Mrs');

-- CreateEnum
CREATE TYPE "public"."IStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('Admin', 'Manager', 'employee');

-- CreateEnum
CREATE TYPE "public"."Line" AS ENUM ('In', 'Out');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DetailUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" "public"."IStatus" NOT NULL,
    "position" TEXT NOT NULL,
    "profilePath" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,

    CONSTRAINT "DetailUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" TEXT NOT NULL,
    "codeNumber" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "cardId" INTEGER NOT NULL,
    "phone" INTEGER NOT NULL,
    "carRegistration" TEXT NOT NULL,
    "status" "public"."IStatus" NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomerHistory" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LineWeighing" (
    "id" TEXT NOT NULL,
    "listWeighing" TEXT NOT NULL,
    "inputWeight" DOUBLE PRECISION NOT NULL,
    "weightOut" DOUBLE PRECISION NOT NULL,
    "netWeight" DOUBLE PRECISION NOT NULL,
    "deductWeight" DOUBLE PRECISION NOT NULL,
    "money" DOUBLE PRECISION NOT NULL,
    "deductMoney" DOUBLE PRECISION NOT NULL,
    "totalMoney" DOUBLE PRECISION NOT NULL,
    "averagePrice" DOUBLE PRECISION NOT NULL,
    "lineType" "public"."Line" NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "LineWeighing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LineWeighingHistory" (
    "id" TEXT NOT NULL,
    "lineWeighingId" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LineWeighingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."DetailUser" ADD CONSTRAINT "DetailUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."DetailUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomerHistory" ADD CONSTRAINT "CustomerHistory_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomerHistory" ADD CONSTRAINT "CustomerHistory_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "public"."DetailUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LineWeighing" ADD CONSTRAINT "LineWeighing_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."DetailUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LineWeighingHistory" ADD CONSTRAINT "LineWeighingHistory_lineWeighingId_fkey" FOREIGN KEY ("lineWeighingId") REFERENCES "public"."LineWeighing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LineWeighingHistory" ADD CONSTRAINT "LineWeighingHistory_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "public"."DetailUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
