-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Рекомендуем', 'Нет_в_наличии', 'Cкидка');

-- CreateEnum
CREATE TYPE "ToolRu" AS ENUM ('ФильтрационнаяСистема', 'ВодяныеНасосы', 'СкиммерМусора', 'НагревательВоды', 'ДозаторХимии', 'СистемаОсвещения', 'ЛестницыИПоручни', 'АрматураПодключения', 'ВентилиИМанометры', 'ТермометрыКонтроля', 'ПокрытиеБассейна', 'ИнвентарьДляЧистки', 'ТестНаборыВоды', 'ХимическиеРеагенты', 'РоботПылесос', 'УфСтерилизатор', 'ОзонГенератор', 'ЭлектролизТузлиСув');

-- CreateEnum
CREATE TYPE "ToolUz" AS ENUM ('FiltrlovchiTizim', 'SuvNasoslari', 'SirtAxloqYiguvchi', 'SuvIsitgichi', 'KimyoviDozator', 'YoritishTizimi', 'ZinapoyaPoydevorlari', 'UlashArmaturasi', 'VentilManometrlar', 'HaroratNazoratchisi', 'BasseynQopqogi', 'TozalashAnjomlari', 'SuvTestToplamlari', 'KimyoModdalari', 'AvtomatikRobot', 'UltravioletSterilizator', 'OzonUretgichi', 'TuzliSuvElektrolizi');

-- CreateTable
CREATE TABLE "ADMIN" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ADMIN_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name_uz" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "discountedPrice" INTEGER NOT NULL,
    "frame_ru" TEXT NOT NULL,
    "frame_uz" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "depth" DOUBLE PRECISION NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Рекомендуем',
    "tools_ru" "ToolRu"[] DEFAULT ARRAY['ФильтрационнаяСистема', 'ВодяныеНасосы']::"ToolRu"[],
    "tools_uz" "ToolUz"[] DEFAULT ARRAY['FiltrlovchiTizim', 'SuvNasoslari']::"ToolUz"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "address_ru" TEXT NOT NULL,
    "address_uz" TEXT NOT NULL,
    "work_time_ru" TEXT NOT NULL,
    "work_time_uz" TEXT NOT NULL,
    "telegram" TEXT NOT NULL,
    "instagram" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ADMIN_username_key" ON "ADMIN"("username");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
