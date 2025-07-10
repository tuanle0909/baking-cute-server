import { RequestHandler } from "express";
import { sendMail } from "../services/mail.service";
import { sendResponse } from "../utils/response";
import { signChangePasswordToken, verifyActivateToken, verifyChangePasswordToken } from "../utils/jwt";
import Account from "../models/account.model";
import bcrypt from 'bcrypt'
import { ApiError } from "../utils/apiError";
import { findOneByUsernameOrEmail } from "../services/user.service";

export const activate: RequestHandler<{}, any, any, {token: string}> = async(req, res, next) => {
    try {
        const { token } = req.query
        const decode = verifyActivateToken(token) as any
        if (!decode) throw new ApiError(401, "Invaild token")
        await Account.findByIdAndUpdate(decode.id, {isActived: true}, {new: true})
        sendResponse(res, 200, 'Your account have actived!')
    } catch (err) {
        next(err)
    }
}

export const changePassword: RequestHandler<{}, any, {password: string, newPassword: string}> = async(req, res, next) => {
    try {
        const { newPassword, password } = req.body
        const { user } = req as any
        const { accountId } = user
        const account = await Account.findById(accountId)
        if (!account) throw new ApiError(401, 'Cannot find account')
        const isMatch = await bcrypt.compare(password, account?.password as string)
        if (!isMatch) throw new ApiError(400, "Password dosen't match")
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await Account.findByIdAndUpdate(accountId, {password: hashedPassword}, {new: true})
        sendResponse(res, 200, 'Change password successfully!')
    } catch (err) {
        next(err)
    }
}

export const requestResetPassword: RequestHandler<{}, any, {email: string}> = async(req, res, next) => {
    try {
        const { email } = req.body
        if (!email) throw new ApiError(401, 'Email is not exist!')
        const user = await findOneByUsernameOrEmail('', email)
        const account = await Account.findOne({userId: user?._id, provider: 'credentials'})
        if (!account) throw new ApiError(401, 'Cannot find account!')
        const payload = {
            accountId: account._id.toString(),
        }
        const token = signChangePasswordToken(payload)
        sendMail(email, 'Đổi mật khẩu',
            `<p>Bấm vào nút bên dưới để đổi mật khẩu</p>
            <a href="${process.env.CLIENT_URL}/test?token=${token}"
                style="
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #ff8fab;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                ">Kích hoạt tài khoản</a>
            <p>Nếu bạn không yêu cầu đăng ký, hãy bỏ qua email này.</p>`
        )
        sendResponse(res, 200, 'Your request has sent!')
    } catch (err) {
        next(err)
    }
}

export const resetPassword: RequestHandler<{}, any, { token: string, newPassword: string}> = async(req, res, next) => {
    try {
        const { newPassword, token} = req.body
        const decode = verifyChangePasswordToken(token) as any
        if (!decode) throw new ApiError(401, 'Invaild Token!')
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await Account.findByIdAndUpdate(decode.accountId, {password: hashedPassword}, {new: true})
        sendResponse(res, 201, 'Change password successfully!')
    } catch (err) {
        next(err)
    }
}