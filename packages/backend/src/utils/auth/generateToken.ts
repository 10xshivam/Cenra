import { Response } from "express";
import jwt from "jsonwebtoken";
import { getAuthCookieOptions } from "./cookieOptions";

export const generateToken = (userId:string,res:Response) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
    )
    res.cookie("token", token, getAuthCookieOptions())
}
