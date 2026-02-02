export const PLAN_FEATURES = {
  STARTER: {
    maxCustomersPerMonth: 200,
    maxWebResources: 1,
    maxDocuments: 5,
    analytics: "standard",
  },

  PRO: {
    maxCustomersPerMonth: Infinity,
    maxWebResources: Infinity,
    maxDocuments: Infinity,
    analytics: "advanced",
  },
} as const;
