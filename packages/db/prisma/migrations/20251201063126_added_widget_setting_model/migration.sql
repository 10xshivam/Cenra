-- CreateTable
CREATE TABLE "WidgetSettings" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "greetMessage" TEXT NOT NULL,
    "defaultSuggestions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WidgetSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WidgetSettings_workspaceId_key" ON "WidgetSettings"("workspaceId");

-- AddForeignKey
ALTER TABLE "WidgetSettings" ADD CONSTRAINT "WidgetSettings_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
