-- AlterTable
ALTER TABLE "user_settings" ADD COLUMN     "notifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "weeklyReport" BOOLEAN NOT NULL DEFAULT true;
