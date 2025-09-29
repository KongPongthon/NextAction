-- CreateTable
CREATE TABLE "public"."DetailReview" (
    "id" TEXT NOT NULL,
    "dormitoryId" TEXT,
    "star" INTEGER NOT NULL,
    "review" TEXT NOT NULL,

    CONSTRAINT "DetailReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Dormitory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalUser" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dormitory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DetailDormitory" (
    "id" TEXT NOT NULL,
    "totalRooms" INTEGER NOT NULL,
    "BusyRooms" INTEGER NOT NULL,
    "dormitoryId" TEXT,

    CONSTRAINT "DetailDormitory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."DetailReview" ADD CONSTRAINT "DetailReview_dormitoryId_fkey" FOREIGN KEY ("dormitoryId") REFERENCES "public"."Dormitory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DetailDormitory" ADD CONSTRAINT "DetailDormitory_dormitoryId_fkey" FOREIGN KEY ("dormitoryId") REFERENCES "public"."Dormitory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
