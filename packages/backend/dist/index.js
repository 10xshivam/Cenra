"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const workspace_route_1 = __importDefault(require("./routes/workspace.route"));
const resource_route_1 = __importDefault(require("./routes/resource.route"));
const conversation_route_1 = __importDefault(require("./routes/conversation.route"));
const customer_route_1 = __importDefault(require("./routes/customer.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const widgetSetting_route_1 = __importDefault(require("./routes/widgetSetting.route"));
const widget_routes_1 = __importDefault(require("./routes/widget.routes"));
const analytics_route_1 = __importDefault(require("./routes/analytics.route"));
const langgraph_1 = require("./config/langgraph");
const subscription_route_1 = __importDefault(require("./routes/subscription.route"));
const webhook_controller_1 = require("./controllers/webhook.controller");
const db_1 = require("@workspace/db");
const qdrant_1 = require("./config/qdrant");
const langgraph_2 = require("./config/langgraph");
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOrigins = (process.env.CORS_ORIGINS ??
    "http://localhost:3000,http://localhost:3001")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
// CORS Configuration
app.use((0, cors_1.default)({
    origin: corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));
app.post("/api/v1/webhook", express_1.default.raw({ type: "application/json" }), webhook_controller_1.webhookController);
// Middleware
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true }));
app.use((0, cookie_parser_1.default)());
// Server Port
const PORT = process.env.PORT;
app.get("/", async (_req, res) => {
    let prismaUp = false;
    let qdrantUp = false;
    let langGraphInitialized = false;
    try {
        await db_1.prisma.$queryRawUnsafe("SELECT 1");
        prismaUp = true;
    }
    catch (error) {
        console.error("Prisma health check failed:", error);
    }
    try {
        await qdrant_1.client.getCollections();
        qdrantUp = true;
    }
    catch (error) {
        console.error("Qdrant health check failed:", error);
    }
    try {
        await (0, langgraph_2.getChatbot)();
        langGraphInitialized = true;
    }
    catch (error) {
        console.error("LangGraph init check failed:", error);
    }
    const allSystemsUp = prismaUp && qdrantUp && langGraphInitialized;
    res.status(allSystemsUp ? 200 : 503).json({
        message: "Welcome to Cenra backend",
        status: allSystemsUp ? "ok" : "degraded",
        services: {
            prisma: prismaUp ? "up" : "down",
            qdrant: qdrantUp ? "up" : "down",
            langGraph: langGraphInitialized ? "initialized" : "not_initialized",
        },
    });
});
// Routes
app.use("/api/v1/auth", user_routes_1.default);
app.use("/api/v1/workspace", workspace_route_1.default);
app.use("/api/v1/workspace", resource_route_1.default);
app.use("/api/v1/workspace", customer_route_1.default);
app.use("/api/v1/workspace", conversation_route_1.default);
app.use("/api/v1/workspace", message_route_1.default);
app.use("/api/v1/workspace", widgetSetting_route_1.default);
app.use("/api/v1/workspace", analytics_route_1.default);
app.use("/api/v1/widget", widget_routes_1.default);
app.use("/api/v1/subscription", subscription_route_1.default);
void (0, langgraph_1.initLangGraph)().catch((error) => {
    console.error("LangGraph warmup failed:", error);
});
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on Port ${PORT}`);
        console.log(`Local: http://localhost:${PORT}`);
    });
}
exports.default = app;
