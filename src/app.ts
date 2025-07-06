import express from "express";
import appRouter from "./routes/appRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// Middleware, route sẽ khai báo ở đây sau
app.use(express.json())
app.use('/api', appRouter)
app.use(errorHandler)
export default app;
