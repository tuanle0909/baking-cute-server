import User from "../models/user.model"

export const findOneByUsernameOrEmail = async(username: string, email: string) => {
    const key = username ? 'username' : 'email'
    const value = username ? username : email
    return await User.findOne({[`${key}`]: value})
}

export const create = async (username: string, email: string, name: string) => {
    return await User.create({username, email, name})
}