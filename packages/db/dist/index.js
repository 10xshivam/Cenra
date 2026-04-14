"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationStatus = exports.prisma = void 0;
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "ConversationStatus", { enumerable: true, get: function () { return client_1.ConversationStatus; } });
exports.prisma = new client_1.PrismaClient();
