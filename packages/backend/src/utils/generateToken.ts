import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (userId:string,res:Response) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
    )
    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    })
}
