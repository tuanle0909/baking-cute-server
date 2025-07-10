import { Router } from "express"
import { googleCallback, login, logout, register } from "../controllers/auth.controller"
import passport from '../config/passport'
import { authenticate } from "../middlewares/authenticate"

const authRouter = Router()

authRouter.post('/login', login)
authRouter.post('/register', register)
authRouter.get('/google', passport.authenticate('google', { session: false, scope: ['profile', 'email'], prompt: 'select_account consent'}))
authRouter.get('/google/callback', passport.authenticate('google', {session: false, failureMessage: 'Faild!'}), googleCallback)
authRouter.post('/logout', authenticate, logout)

export default authRouter