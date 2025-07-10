import { Router } from "express"
import { activate, changePassword, requestResetPassword, resetPassword } from "../controllers/account.controller";
import { authenticate } from "../middlewares/authenticate";

const accountRouter = Router();

accountRouter.get('/activate', activate)
accountRouter.post('/change-password', authenticate, changePassword)
accountRouter.post('/request-reset-password', requestResetPassword)
accountRouter.post('/reset-password', resetPassword)
export default accountRouter