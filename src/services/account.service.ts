import Account from "../models/account.model"

export const create = async(userId: string, hashedPassword: string) => {
    return await Account.create({
        userId, 
        password: hashedPassword, 
        provider: 'credentials'
    })
}

export const findOnebyUserId = async(userId: string) => {
    return await Account.findOne({userId})
}