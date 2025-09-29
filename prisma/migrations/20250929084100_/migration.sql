-- CreateEnum
CREATE TYPE "public"."Prefix" AS ENUM ('Mr', 'Mrs');

-- CreateEnum
CREATE TYPE "public"."IStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('Admin', 'Manager', 'employee');

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
    "prefix" "public"."Prefix" NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" "public"."IStatus" NOT NULL,
    "position" TEXT NOT NULL,
    "profilePath" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,

    CONSTRAINT "DetailUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."DetailUser" ADD CONSTRAINT "DetailUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
