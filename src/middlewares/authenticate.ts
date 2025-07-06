import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Unauthorize");
        }
        const token = authHeader.split(" ")[1]
        const decoded = verifyAccessToken(token) as any
        (req as any).user = decoded
        next()
    } catch (err) {
        next(new ApiError(401, "Invalid token"))
    }
}