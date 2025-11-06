import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes';
import workspaceRouter from './routes/workspace.route';

dotenv.config();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true, 
  })
);

// Middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))
app.use(cookieParser());

// Server Port
const PORT = process.env.PORT;

// Routes
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/workspace", workspaceRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
    console.log(`Local: http://localhost:${PORT}`);
});