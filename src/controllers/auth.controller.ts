import { RequestHandler } from "express-serve-static-core";
import { sendResponse } from "../utils/response";
import bcrypt from 'bcrypt' 
import { create as createUser, findOneByUsernameOrEmail } from "../services/user.service";
import { create as createAccount } from "../services/account.service";
import { ApiError } from "../utils/apiError";
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
        console.log(username, email, password)
        sendResponse(res, 200, 'Login successfully!')
    } catch (err) {
        next(err)
    }
}

export const register: RequestHandler<{}, any, RegisterInput> = async(req, res, next) => {
    try {
        const { username, email, password } = req.body
        const existedUser = await findOneByUsernameOrEmail(username, email)
        if (existedUser) throw new ApiError(400, 'Username or Email is already exist')
        const user = await createUser(username, email)
        const hashedPassword = await bcrypt.hash(password, 10)
        await createAccount(user._id.toString(), hashedPassword)
        sendResponse(res, 201, 'Register successfully!', createAccount)
    } catch (err) {
        next(err)
    }
}


