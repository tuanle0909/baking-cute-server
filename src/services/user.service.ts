import User from "../models/user.model"

export const findOneByUsernameOrEmail = async(username: string, email: string) => {
    return await User.findOne({
        $or: [{username, email}]
    })
}

export const create = async (username: string, email: string) => {
    return await User.create({username, email})
}