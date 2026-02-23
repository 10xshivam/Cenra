-- AlterTable
ALTER TABLE "WidgetSettings" RENAME COLUMN "gradientTo" TO "themeColor";

-- AlterColumn
ALTER TABLE "WidgetSettings" ALTER COLUMN "themeColor" SET DEFAULT '#047857';
