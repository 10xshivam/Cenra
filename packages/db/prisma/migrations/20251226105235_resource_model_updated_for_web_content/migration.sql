/*
  Warnings:

  - The values [URL] on the enum `ResourceSourceType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `text` on the `Resource` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ResourceSourceType_new" AS ENUM ('WEB', 'FILE');
ALTER TABLE "Resource" ALTER COLUMN "sourceType" TYPE "ResourceSourceType_new" USING ("sourceType"::text::"ResourceSourceType_new");
ALTER TYPE "ResourceSourceType" RENAME TO "ResourceSourceType_old";
ALTER TYPE "ResourceSourceType_new" RENAME TO "ResourceSourceType";
DROP TYPE "public"."ResourceSourceType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "text",
ADD COLUMN     "fileText" TEXT,
ADD COLUMN     "webContent" JSONB;
