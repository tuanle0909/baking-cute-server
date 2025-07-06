import { Request, Response } from "express";

type LoginInput = {
    username: string,
    email: string,
    password: string
}

export const accountController = {
    login: async(req: Request<{}, {}, LoginInput>, res: Response) => {
        try {
            const { username, email, password } = req.body
            console.log(username, email, password)
            return res.status(200).send(req.body)
        } catch (err) {
            console.log(err)
            return res.status(500)
        }
    }
}