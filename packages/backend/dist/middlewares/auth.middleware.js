"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized: No token provided." });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized: Invalid token." });
        }
        const { userId } = decoded;
        req.userId = userId;
        next();
    }
    catch (error) {
        console.error("Error verifying token:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
exports.verifyAuth = verifyAuth;
