import express from "express"

const app = express();

// middlewares
import cookieParser from "cookie-parser";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin : "*",
    credentials : true    
}))


// Routers - 
import userRouter from "./modules/user/user.routes.js";
import postRouter from "./modules/post/post.routes.js";
import commentRouter from "./modules/comment/comment.routes.js";
import voteRouter from "./modules/vote/vote.route.js";
import notificationRouter from "./modules/notification/notification.route.js";
import adminRouter from "./modules/admin/admin.routes.js";
import reportRouter from "./modules/report/report.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/posts/:post_id/comments", commentRouter);
app.use("/api/v1/posts/:post_id/votes", voteRouter);
app.use("/api/v1/notifications",notificationRouter);
app.use("/api/v1/posts/:post_id/reports", reportRouter);
app.use("/api/v1/admin", adminRouter);




// Error middleware
app.use(errorMiddleware);

export default app;