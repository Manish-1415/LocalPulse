import type { Request, Response } from "express";
import ApiResponse from "../../utility/ApiResponse.js";
import adminService from "./admin.services.js";
import { postResolutionSchema, removePostStatusSchema } from "./admin.validation.js";

export const getUsers = async (req : Request, res : Response) => {
    const page = req.params.page as string;
    const limit = req.params.limit as string;

    const users = await adminService.getUserEntries(page, limit);

    return res
    .status(200)
    .json(new ApiResponse(200, "Users Fetched Successfully", {users, page, limit}));
}

export const getSingleUser = async (req : Request, res : Response) => {
    const userId : string = req.params.user_id as string;
    
    const user = await adminService.getSingleUserEntry(userId);

    return res
    .status(200)
    .json(new ApiResponse(200, "Users Fetched Successfully", user));
}

export const deleteUser = async (req : Request, res : Response) => {
    const userId : string = req.params.user_id as string;

    const deletedUser = await adminService.deleteUserEntry(userId);

    return res
    .status(200)
    .json(new ApiResponse(200, "Users Deleted Successfully", {user : deletedUser.name, message : "User Deleted"}));
}



// Posts -

export const getPosts = async (req : Request, res : Response) => {
    const page : number = parseInt(req.query.page as string);
    const limit : number = parseInt(req.query.limit as string);

    const posts = await adminService.getMultiplePosts(page, limit);

    return res
    .status(200)
    .json(new ApiResponse(200, "Posts Fetched For Admin", posts));
}



export const updatePostStatus = async (req : Request, res : Response) => {
    const postId : string  = req.params.post_id as string;
    const status = removePostStatusSchema.parse(req.body);

    const removedPost = await adminService.postStatusRemove(status.status, postId);

    return res
    .status(200)
    .json(new ApiResponse(200, "Post status Removed", {postId : removedPost._id, title : removedPost.title, images : removedPost.images}));
}




// reports

export const pendingReports = async (req : Request, res : Response) => {
    const page : number = parseInt(req.query.page as string);
    const limit : number = parseInt(req.query.limit as string);

    const reports = await adminService.getPendingReportEntries(page, limit);

    return res
    .status(200)
    .json(new ApiResponse(200, "Pending Reports Fetched", reports));
}

export const getPendingReport = async (req : Request, res : Response) => {
    const reportId : string = req.params.report_id as string;

    const report = await adminService.getSinglePendingReport(reportId);

    return res
    .status(200)
    .json(new ApiResponse(200, "Single Pending Report Fetched", report));
}


export const reportResolution = async (req : Request, res : Response) => {
    const reportId : string = req.params.report_id as string;
    const status = postResolutionSchema.parse(req.body);


    const report = await adminService.giveResolutionToReport(reportId, status.status);
    
    return res
    .status(200)
    .json(new ApiResponse(200, "Resolution Given to the Post ", report));
}


export const getAdminDashboardData = async (req : Request, res : Response) => {
    
    const adminData = await adminService.fetchAdminDashboardData();

    return res
    .status(200)
    .json(new ApiResponse(200, "Admin Dashboard Data Fetched", adminData));
}