-- CreateTable
CREATE TABLE "DiscountHistory" (
    "id" TEXT NOT NULL,
    "cartJson" JSONB NOT NULL,
    "campaignJson" JSONB NOT NULL,
    "result" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscountHistory_pkey" PRIMARY KEY ("id")
);
