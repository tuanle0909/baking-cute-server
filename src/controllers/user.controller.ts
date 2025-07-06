import { RequestHandler } from "express"
import { sendResponse } from "../utils/response"
import User from "../models/user.model"

export const getAll: RequestHandler<{}, any, {}> = async(req, res, next) => {
    try {
        const userList = await User.find().lean()
        sendResponse(res, 200, 'Request success!', userList)
    } catch (err) {
        next(err)
    }
}

export const getById: RequestHandler<{id: string}, any, {}> = async(req, res, next) => {
    try {
        const { id } = req.params
        sendResponse(res, 200, 'Request success!', id)
    } catch (err) {
        next(err)
    }
}