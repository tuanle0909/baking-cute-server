import { Router } from "express"
import authRouter from "./auth.route"
import userRouter from "./user.route"

const appRouter = Router()

appRouter.use('/auth', authRouter)
appRouter.use('/user', userRouter)

export default appRouter