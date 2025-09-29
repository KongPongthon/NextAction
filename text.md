# RubberYard Development & Production Guide

## 🛠 Development (Local)

### 1. ติดตั้ง dependencies

```bash
pnpm install

docker-compose up -d postgres

pnpm dev


```

## 🚀 Production (Docker)

### 1. ติดตั้ง dependencies

```bash
pnpm install

docker-compose up --build -d

pnpm docker:logs

```

## 🖥 เริ่มรัน server / Docker

### Build และ run ทั้งเว็บ + DB

```bash

docker-compose up -d --build

```

### รัน server (เว็บ + DB)

```bash

docker-compose up -d
```

### รันเฉพาะ postgres

```bash

docker-compose up -d postgres

```

### ตรวจสอบ container

```bash

docker ps

```

### ดู logs ของ web แบบ real-time

```bash

docker-compose logs -f web

```

### เข้า container web (shell)

```bash

docker exec -it rubberyard_app sh

```

### ⚙️ Package.json Scripts (สำหรับ Prisma)

#### Windows

```bash
{
  "db:generate": "prisma generate",
  "db:migrate": "prisma migrate dev",
  "db:migrate:prod": "prisma migrate deploy",
  "db:push": "prisma db push",
  "db:seed": "prisma db seed",
  "db:reset": "prisma migrate reset",
  "db:status": "prisma migrate status",
  "db:studio": "prisma studio",
  "db:dev": "prisma generate && prisma migrate dev",
  "db:check": "prisma migrate status && prisma generate"
}
```

#### MacOs

```bash

{
  "db:generate": "pnpm prisma generate",
  "db:migrate": "pnpm prisma migrate dev",
  "db:migrate:prod": "pnpm prisma migrate deploy",
  "db:push": "pnpm prisma db push",
  "db:seed": "pnpm prisma db seed",
  "db:reset": "pnpm prisma migrate reset",
  "db:status": "pnpm prisma migrate status",
  "db:studio": "pnpm prisma studio",
  "db:dev": "pnpm prisma generate && pnpm prisma migrate dev",
  "db:check": "pnpm prisma migrate status && pnpm prisma generate"
}

```

# ✅ กรณีที่คุณ ต้องการให้ฐานข้อมูล PostgreSQL อัพเดทตาม schema.prisma

```bash

npx prisma migrate dev --name <ชื่อการเปลี่ยนแปลง>

```

## สรุปคำสั่งแบบรวบรัด

```bash
# stop & remove postgres + volume
docker-compose down -v

# ลบ migrations เก่า
rm -rf prisma/migrations

# run docker
docker-compose up -d postgres

# สร้าง migration ใหม่
npx prisma migrate dev --name init

# generate Prisma Client
npx prisma generate

# ตรวจสอบ DB
npx prisma studio

```
