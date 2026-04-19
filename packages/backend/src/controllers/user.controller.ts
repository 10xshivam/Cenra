import { Request, Response } from "express";
import { prisma } from "@workspace/db";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/auth/generateToken";
import { getGoogleUserProfile } from "../utils/auth/googleAuth";
import { setWorkspaceCookie } from "../utils/auth/setWorkspaceCookie";
import { setSubscriptionCookie } from "../utils/auth/setSubscriptionCookie";
import { getAuthCookieOptions } from "../utils/auth/cookieOptions";

export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashPassword,
      },
    });

    if (user) {
      generateToken(user.id, res);
      await setWorkspaceCookie(user.id, res);
      await setSubscriptionCookie(user.id, res);
      return res.status(201).json({
        message: "User registered successfully.",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    generateToken(user.id, res);
    await setWorkspaceCookie(user.id, res);
    await setSubscriptionCookie(user.id, res);
    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  const cookieOptions = getAuthCookieOptions();
  // Express `clearCookie` sets its own expires, but passing `maxAge` overrides it.
  delete cookieOptions.maxAge;
  
  res.clearCookie("token", cookieOptions);
  res.clearCookie("hasWorkspace", cookieOptions);
  res.clearCookie("hasSubscription", cookieOptions);
  return res.status(200).json({ message: "Logout successful." });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const user = await prisma.user.findUnique({
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
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  const { code } = req.body;

  try {
    if (!code) {
      return res.status(400).json({ message: "Google auth code is required." });
    }

    const googleProfile = await getGoogleUserProfile(code);

    if (!googleProfile) {
      return res.status(401).json({ message: "Invalid Google auth code." });
    }

    const { email, given_name, family_name } = googleProfile;

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        firstName: given_name,
        lastName: family_name || "",
      },
      create: {
        email,
        firstName: given_name,
        lastName: family_name || "",
        password: await bcrypt.hash(Math.random().toString(36), 10),
      },
    });

    generateToken(user.id, res);
    await setWorkspaceCookie(user.id, res);
    await setSubscriptionCookie(user.id, res);
    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in user with Google:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const updateUser = async (req: Request, res: Response) => {
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
      const existing = await prisma.user.findUnique({ where: { email: email.trim() } });
      if (existing && existing.id !== userId) {
        return res.status(409).json({ message: "This email is already in use by another account." });
      }
    }

    const user = await prisma.user.update({
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
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

