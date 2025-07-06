import { RequestHandler } from "express";
import { ApiError } from "../utils/apiError";

export const authorizeRole = (...role: string[]): RequestHandler => {
    return (req, res, next) => {
        const user = (req as any).user
        if (!role.includes(user.role)) {
            throw new ApiError(403, "Unauthorize");
        }
        next();
    };
};