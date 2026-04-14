"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAN_FEATURES = void 0;
exports.PLAN_FEATURES = {
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
};
