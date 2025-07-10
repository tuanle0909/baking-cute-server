import { Session } from "../models/session.model"

export const create = async(userId: string, accountId: string, token: string, expiresAt: Date, provider: string) => {
    return await Session.create({
        userId,
        accountId,
        token,
        expiresAt,
        provider
    })
}