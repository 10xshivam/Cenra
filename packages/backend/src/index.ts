import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes';

dotenv.config();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "*", 
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
    console.log(`Local: http://localhost:${PORT}`);
});