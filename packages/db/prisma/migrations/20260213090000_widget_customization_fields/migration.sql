ALTER TABLE "WidgetSettings"
ADD COLUMN "brandName" TEXT,
ADD COLUMN "companyLogoUrl" TEXT,
ADD COLUMN "homeGreetingMessage" TEXT NOT NULL DEFAULT 'Hello there. How can we help?',
ADD COLUMN "firstMessage" TEXT NOT NULL DEFAULT 'Hi! How can I help you today?',
ADD COLUMN "themeMode" TEXT NOT NULL DEFAULT 'light',
ADD COLUMN "gradientFrom" TEXT NOT NULL DEFAULT '#052e2b',
ADD COLUMN "gradientTo" TEXT NOT NULL DEFAULT '#f5f5f5',
ADD COLUMN "whatsNewSection" JSONB,
ADD COLUMN "featuredArticlesSection" JSONB;
