import { Router } from "express"
import { accountController } from "../controllers/account.controller";

const accountRouter = Router();

const { login } = accountController
// accountRouter.post()