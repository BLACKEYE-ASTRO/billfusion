-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "transferAccountId" TEXT;

-- CreateIndex
CREATE INDEX "transactions_transferAccountId_idx" ON "transactions"("transferAccountId");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transferAccountId_fkey" FOREIGN KEY ("transferAccountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
