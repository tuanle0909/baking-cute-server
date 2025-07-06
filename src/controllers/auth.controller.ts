import { RequestHandler } from "express-serve-static-core";
import { sendResponse } from "../utils/response";
import bcrypt from 'bcrypt' 
import { create as createUser, findOneByUsernameOrEmail } from "../services/user.service";
import { create as createAccount, findOnebyUserId } from "../services/account.service";
import { create as createSession } from "../services/session.service";
import { ApiError } from "../utils/apiError";
import { signAccessToken, signRefreshToken } from "../utils/jwt";

type LoginInput = {
    username: string,
    email: string,
    password: string
}

type RegisterInput = {
    username: string,
    email: string,
    password: string
}

export const login: RequestHandler<{}, any, LoginInput> = async(req, res, next) => {
    try {
        const { username, email, password } = req.body
        const user = await findOneByUsernameOrEmail(username, email)
        if (!user) throw new ApiError(401, "Username or email doesn't exist")
        const account = await findOnebyUserId(user._id.toString())
        if (!account) throw new ApiError(401, "Cannot find account, please try again")
        const isMatch = await bcrypt.compare(password, account?.password as string)
        if (!isMatch) throw new ApiError(401, "Username or email doesn't exist")
        const payload = {
            userId: user._id.toString(),
            username: user.username,
            email: user.email,
            avatar: user.avatarUrl,
            role: user.role
        }
        const accessToken = signAccessToken(payload)
        const refreshToken = signRefreshToken(payload)
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await createSession(user._id.toString(), refreshToken, expiresAt)
        sendResponse(res, 200, 'Login successfully!', {
            user: payload,
            accessToken
        })
    } catch (err) {
        next(err)
    }
}

export const register: RequestHandler<{}, any, RegisterInput> = async(req, res, next) => {
    try {
        const { username, email, password } = req.body
        const existedUser = await findOneByUsernameOrEmail(username, email)
        if (existedUser) throw new ApiError(409, 'Username or Email is already exist')
        const user = await createUser(username, email)
        const hashedPassword = await bcrypt.hash(password, 10)
        await createAccount(user._id.toString(), hashedPassword)
        sendResponse(res, 201, 'Register successfully!', createAccount)
    } catch (err) {
        next(err)
    }
}


