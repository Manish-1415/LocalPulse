import ApiError from "../../utility/ApiError.js";
import Post from "../post/post.model.js";
import Report from "../report/report.model.js";
import User from "../user/user.model.js";
import { redis } from "../../configs/redisClient.js";

const adminService = {
    getUserEntries : async (pageNo : string, limitNo : string) => {
        const page = parseInt(pageNo);
        const limit = parseInt(limitNo);
        const skip = (page - 1) * limit;
        const users = await User.find().sort({createdAt : - 1}).skip(skip).limit(limit).select("name email avatar city").lean();

        if(users.length === 0) return { users : users.length, message : "No Users at this moment" }

        return users;
    },

    getSingleUserEntry : async (userId : string) => {
        const user = await User.findById(userId).lean();

        if(!user) throw new ApiError(404, "User Not Found");

        return user;
    },


    deleteUserEntry : async (userId : string) => {
        const user = await User.findByIdAndDelete(userId);

        if(!user) throw new ApiError(404, "User Entry not found");

        return user;
    },


    getMultiplePosts : async (page : number, limit : number) => {
        const skip = (page - 1) * limit;

        const posts = await Post.find().skip(skip).limit(limit).lean();

        if(posts.length === 0) return {message : "No Posts to Fetch", posts : posts.length}

        return {posts, page, limit};
    },

    postStatusRemove : async (status : string, postId : string) => {
        const post = await Post.findByIdAndUpdate({_id : postId}, { $set : {status} }, {new : true, runValidators : true});

        if(!post) throw new ApiError(500, "Error Occurred while updating post status Or Post Not Found");

        return post;
    },


    getPendingReportEntries : async (page: number, limit : number) => {
        const skip = (page - 1) * 10;

        const pendingReports = await Report.find({status: "pending"}).sort({createdAt : -1}).skip(skip).limit(limit).lean();

        if(pendingReports.length === 0) return {pendingReportsNo : pendingReports.length, message : "No Pending Reports Right Now"}

        return {pendingReports, page, limit};
    },

    getSinglePendingReport : async (reportId : string) => {
        const report = await Report.findById(reportId);

        if(!report) throw new ApiError(404, "Post Not Found");

        return report;
    },

    giveResolutionToReport : async (reportId : string, status : string) => {
        const report = await Report.findByIdAndUpdate(reportId, { $set : {status} }, {new : true});

        if(!report) throw new ApiError(404, "Report Not Found Or Error Occurred while giving resoltution to report");

        return report;
    },


    fetchAdminDashboardData : async () => {
        const adminStats = await redis.get(`admin:stats`);
        if(adminStats) return JSON.parse(adminStats);

        const [
            totalUsers,
            totalPosts,
            openPosts,
            resolvedPosts,
            removedPosts,
            pendingReports,
        ] = await Promise.all([
            User.countDocuments(),
            Post.countDocuments(),
            Post.countDocuments({status : 'open'}),
            Post.countDocuments({status : 'resolved'}),
            Post.countDocuments({status : 'removed'}),
            Report.countDocuments({status : 'pending'})
        ]);


        await redis.set(`admin:stats`,JSON.stringify({totalUsers,totalPosts,openPosts,resolvedPosts,removedPosts,pendingReports}), "EX", 500);

        return {
            totalUsers,
            totalPosts,
            openPosts,
            resolvedPosts,
            removedPosts,
            pendingReports,
        }
    }
}


export default adminService;