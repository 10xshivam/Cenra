import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes";
import workspaceRouter from "./routes/workspace.route";
import resourceRouter from "./routes/resource.route";
import conversationRouter from "./routes/conversation.route";
import customerRouter from "./routes/customer.route";
import messageRouter from "./routes/message.route";
import widgetSettingRouter from "./routes/widgetSetting.route";
import widgetRouter from "./routes/widget.routes";
import { initLangGraph } from "./config/langgraph";

dotenv.config();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Server Port
const PORT = process.env.PORT;

// Routes
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/workspace", workspaceRouter);
app.use("/api/v1/workspace", resourceRouter);
app.use("/api/v1/workspace", customerRouter);
app.use("/api/v1/workspace", conversationRouter);
app.use("/api/v1/workspace", messageRouter);
app.use("/api/v1/workspace", widgetSettingRouter);
app.use("/api/v1/widget", widgetRouter);

// Start the server
initLangGraph().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
    console.log(`Local: http://localhost:${PORT}`);
  });
});
