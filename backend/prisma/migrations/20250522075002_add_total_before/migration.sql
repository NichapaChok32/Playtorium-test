/*
  Warnings:

  - You are about to drop the column `result` on the `DiscountHistory` table. All the data in the column will be lost.
  - Added the required column `totalAfter` to the `DiscountHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalBefore` to the `DiscountHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscountHistory" DROP COLUMN "result",
ADD COLUMN     "totalAfter" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalBefore" DOUBLE PRECISION NOT NULL;
