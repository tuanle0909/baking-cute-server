import { Session } from "../models/session.model"

export const create = async(userId: string, token: string, expiresAt: Date) => {
    return await Session.create({
        userId,
        token,
        expiresAt
    })
}