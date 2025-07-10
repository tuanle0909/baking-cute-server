import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string
const ACTIVATE_TOKEN_SECRET = process.env.ACTIVATE_TOKEN_SECRET as string
const CHANGE_PASSWORD_TOKEN_SECRET = process.env.CHANGE_PASSWORD_TOKEN_SECRET as string

export const signAccessToken = (payload: any) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

export const signRefreshToken = (payload: any) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}


export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
}


export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
}

export const signActivateToken = (payload: any) => {
    return jwt.sign(payload, ACTIVATE_TOKEN_SECRET, { expiresIn: "15m" })
}

export const verifyActivateToken = (token: string) => {
    return jwt.verify(token, ACTIVATE_TOKEN_SECRET)
}

export const signChangePasswordToken = (payload: any) => {
    return jwt.sign(payload, CHANGE_PASSWORD_TOKEN_SECRET, { expiresIn: '5m'})
}

export const verifyChangePasswordToken = (token: string) => {
    return jwt.verify(token, CHANGE_PASSWORD_TOKEN_SECRET)
}