"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.googleLogin = exports.getCurrentUser = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const db_1 = require("@workspace/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("../utils/auth/generateToken");
const googleAuth_1 = require("../utils/auth/googleAuth");
const setWorkspaceCookie_1 = require("../utils/auth/setWorkspaceCookie");
const setSubscriptionCookie_1 = require("../utils/auth/setSubscriptionCookie");
const cookieOptions_1 = require("../utils/auth/cookieOptions");
const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const existingUser = await db_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }
        const hashPassword = await bcrypt_1.default.hash(password, 10);
        const user = await db_1.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashPassword,
            },
        });
        if (user) {
            (0, generateToken_1.generateToken)(user.id, res);
            await (0, setWorkspaceCookie_1.setWorkspaceCookie)(user.id, res);
            await (0, setSubscriptionCookie_1.setSubscriptionCookie)(user.id, res);
            return res.status(201).json({
                message: "User registered successfully.",
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            });
        }
        else {
            return res.status(400).json({ message: "Invalid user data." });
        }
    }
    catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const user = await db_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }
        (0, generateToken_1.generateToken)(user.id, res);
        await (0, setWorkspaceCookie_1.setWorkspaceCookie)(user.id, res);
        await (0, setSubscriptionCookie_1.setSubscriptionCookie)(user.id, res);
        return res.status(200).json({
            message: "Login successful.",
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    }
    catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
exports.loginUser = loginUser;
const logoutUser = (req, res) => {
    const cookieOptions = (0, cookieOptions_1.getAuthCookieOptions)();
    res.clearCookie("token", cookieOptions);
    res.clearCookie("hasWorkspace", cookieOptions);
    res.clearCookie("hasSubscription", cookieOptions);
    return res.status(200).json({ message: "Logout successful." });
};
exports.logoutUser = logoutUser;
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized." });
        }
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json({
            message: "User profile retrieved successfully.",
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
exports.getCurrentUser = getCurrentUser;
const googleLogin = async (req, res) => {
    const { code } = req.body;
    try {
        if (!code) {
            return res.status(400).json({ message: "Google auth code is required." });
        }
        const googleProfile = await (0, googleAuth_1.getGoogleUserProfile)(code);
        if (!googleProfile) {
            return res.status(401).json({ message: "Invalid Google auth code." });
        }
        const { email, given_name, family_name } = googleProfile;
        const user = await db_1.prisma.user.upsert({
            where: { email },
            update: {
                firstName: given_name,
                lastName: family_name,
            },
            create: {
                email,
                firstName: given_name,
                lastName: family_name,
                password: await bcrypt_1.default.hash(Math.random().toString(36), 10),
            },
        });
        (0, generateToken_1.generateToken)(user.id, res);
        await (0, setWorkspaceCookie_1.setWorkspaceCookie)(user.id, res);
        await (0, setSubscriptionCookie_1.setSubscriptionCookie)(user.id, res);
        return res.status(200).json({
            message: "Login successful.",
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Error logging in user with Google:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
exports.googleLogin = googleLogin;
const updateUser = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized." });
        }
        const { firstName, lastName, email } = req.body;
        if (!firstName || !lastName) {
            return res.status(400).json({ message: "First name and last name are required." });
        }
        if (email) {
            const existing = await db_1.prisma.user.findUnique({ where: { email: email.trim() } });
            if (existing && existing.id !== userId) {
                return res.status(409).json({ message: "This email is already in use by another account." });
            }
        }
        const user = await db_1.prisma.user.update({
            where: { id: userId },
            data: {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                ...(email && { email: email.trim() }),
            },
        });
        return res.status(200).json({
            message: "Profile updated successfully.",
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    }
    catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
exports.updateUser = updateUser;
