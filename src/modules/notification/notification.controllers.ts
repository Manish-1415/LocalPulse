import type { Request, Response } from "express";
import notificationService from "./notification.services.js";
import ApiResponse from "../../utility/ApiResponse.js";


export const getNotifications = async (req : Request, res : Response) => {
    const userId : string = req.user?._id!;

    const notifications = await notificationService.getNotifications(userId);

    return res
    .status(200)
    .json(new ApiResponse(200, "Notifications Fetched Successfully", notifications));
}


export const readNotifications = async (req : Request, res : Response) => {
    const userId : string = req.user?._id!;

    const notifications = await notificationService.readAllComments(userId);

    return res
    .status(200)
    .json(new ApiResponse(200, "Notifications readed successfully", {message : "Notifications Deleted after reading"}));
}




