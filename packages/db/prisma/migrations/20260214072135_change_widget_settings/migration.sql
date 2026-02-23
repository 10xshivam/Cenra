/*
  Warnings:

  - You are about to drop the column `companyLogoUrl` on the `WidgetSettings` table. All the data in the column will be lost.
  - You are about to drop the column `firstMessage` on the `WidgetSettings` table. All the data in the column will be lost.
  - You are about to drop the column `homeGreetingMessage` on the `WidgetSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WidgetSettings" DROP COLUMN "companyLogoUrl",
DROP COLUMN "firstMessage",
DROP COLUMN "homeGreetingMessage";
