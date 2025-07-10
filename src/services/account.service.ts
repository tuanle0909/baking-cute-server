import Account from "../models/account.model"

export const create = async(userId: string, hashedPassword: string, provider: string, providerId: string) => {
    return await Account.create({
        userId,
        password: hashedPassword, 
        provider,
        providerId
    })
}

export const findOnebyUserId = async(userId: string) => {
    return await Account.findOne({userId})
}