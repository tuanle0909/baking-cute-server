import { Router } from "express";
import { getAll, getById } from "../controllers/user.controller";
import { authenticate } from "../middlewares/authenticate";
import { authorizeRole } from "../middlewares/authorizeRole";

const userRouter = Router()

userRouter.get('/', authenticate, authorizeRole('admin'), getAll)
userRouter.get('/:id', getById)

export default userRouter