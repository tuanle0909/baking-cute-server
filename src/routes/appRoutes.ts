import { Router } from "express"
import authRouter from "./auth.route"
import userRouter from "./user.route"
import accountRouter from "./account.route"

const appRouter = Router()

appRouter.use('/auth', authRouter)
appRouter.use('/user', userRouter)
appRouter.use('/account', accountRouter)

export default appRouter