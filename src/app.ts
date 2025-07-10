import express from "express";
import session from 'express-session'
import appRouter from "./routes/appRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import passport from './config/passport'
import dotenv from "dotenv";
const app = express();

dotenv.config();
// Middleware, route sẽ khai báo ở đây sau

app.use(passport.initialize())
app.use(express.json())
app.use('/api', appRouter)
app.use(errorHandler)

export default app;
