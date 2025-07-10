import { RequestHandler } from "express-serve-static-core";
import { sendResponse } from "../utils/response";
import bcrypt from 'bcrypt' 
import { create as createUser, findOneByUsernameOrEmail } from "../services/user.service";
import { create as createAccount, findOnebyUserId } from "../services/account.service";
import { create as createSession } from "../services/session.service";
import { ApiError } from "../utils/apiError";
import { signAccessToken, signActivateToken, signRefreshToken } from "../utils/jwt";
import { sendMail } from "../services/mail.service";
import { Session } from "../models/session.model";

type LoginInput = {
    username: string,
    email: string,
    password: string
}

type RegisterInput = {
    username: string,
    email: string,
    password: string
    name: string
}

export const login: RequestHandler<{}, any, LoginInput> = async(req, res, next) => {
    try {
        const { username, email, password } = req.body
        const user = await findOneByUsernameOrEmail(username, email)
        if (!user) throw new ApiError(401, "Username or email doesn't exist")
        const account = await findOnebyUserId(user._id.toString())
        if (!account) throw new ApiError(401, "Cannot find account, please try again")
        const isMatch = await bcrypt.compare(password, account?.password as string)
        if (!isMatch) throw new ApiError(401, "Username or password doesn't exist")
        const payload = {
            userId: user._id.toString(),
            accountId: account._id.toString(),
            username: user.username,
            email: user.email,
            avatar: user.avatarUrl,
            role: user.role
        }
        const session = await Session.findOne({userId: user._id.toString(), provider: 'credentials'})
        const accessToken = signAccessToken(payload)
        if (!session) {
            const refreshToken = signRefreshToken(payload)
            const expiresAt = new Date(Date.now() + 10000)
            await createSession(user._id.toString(), account._id.toString(), refreshToken, expiresAt, 'credentials')
        }
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
        const { username, email, name, password } = req.body
        const existedUser = await findOneByUsernameOrEmail(username, email)
        if (existedUser) throw new ApiError(409, 'Username or Email is already exist')
        const user = await createUser(username, email, name)
        const hashedPassword = await bcrypt.hash(password, 10)
        const account = await createAccount(user._id.toString(), hashedPassword, 'credentials', user._id.toString())
        const token = signActivateToken({id: account._id.toString()})
        await sendMail(email, "",  `
            <h2>Chào ${user.username},</h2>
            <p>Bấm vào nút bên dưới để kích hoạt tài khoản của bạn:</p>
            <a href="${process.env.SERVER_URL}/api/account/activate?token=${token}"
                style="
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #ff8fab;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                ">Kích hoạt tài khoản</a>
            <p>Nếu bạn không yêu cầu đăng ký, hãy bỏ qua email này.</p>
        `)
        sendResponse(res, 201, 'Register successfully!', createAccount)
    } catch (err) {
        next(err)
    }
}

export const googleCallback: RequestHandler<{}, any> = async(req, res, next) => {
    const { user } = req as any
    if (!user) {
        return next(new ApiError(401, 'Đăng nhập Google thất bại'));
    }
    const session = await Session.findOne({userId: user.userId, provider: 'google'})
    const accessToken = signAccessToken(user)
    if (!session) {
        const refreshToken = signRefreshToken(user)
        const expiresAt = new Date(Date.now() + 10000)
        await createSession(user.userId, user.accountId, refreshToken, expiresAt, 'google')
    }
    sendResponse(res, 200, 'Đăng nhập Google thành công', {
        user: {...user},
        accessToken
    });
}

export const logout: RequestHandler<{}, any> = async(req, res, next) => {
    try {
        const { user } = req as any
        const { accountId } = user
        const destroySession = await Session.findOneAndDelete({accountId})
        if (!destroySession) throw new ApiError(404, 'User not found')
        sendResponse(res, 200, 'Logout successfully!')
    } catch (err) {
        next(err)
    }
}



