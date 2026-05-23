import Notification from "./notification.model.js";
import ApiError from "../../utility/ApiError.js";
import { redis } from "../../configs/redisClient.js";
import type { CreateNotificationView } from "./notification.validation.js";

const notificationService = {
    getNotifications : async (userId : string) => {

        const cache = await redis.get(`notifications:${userId}`);

        if(cache) return JSON.parse(cache);

        const notifications = await Notification.find({recipient : userId, read : false})
        .sort({read : 1, createdAt : -1})
        .populate("triggeredBy", "name avatar")
        .lean();

        if(notifications.length === 0){
            return { notifications : 0 , message : "No Notifications for User yet" }
        }

        await redis.set(`notifications:${userId}`, JSON.stringify(notifications), "EX", 900);

        return notifications;
    },

    readAllComments : async (userId : string) => {
        let notifications = await Notification.deleteMany(
            { recipient : userId,  read : false}
        );

        if(!notifications) throw new ApiError(500, "Error Occurred while deleting notifications");

        if(notifications.deletedCount === 0) return { notification : notifications.deletedCount, message : "No notifications to delete" }

        return notifications;
    },


    createNotification : async ({recipient , triggeredBy, post, read, message, type} : CreateNotificationView) => {
        if(triggeredBy.toString() === recipient.toString()) return;

        const notification = await Notification.create({recipient, triggeredBy, type, post, read, message});

        if(!notification) throw new ApiError(500, "Error Occurred While Creating Notification");
    }
}


export default notificationService;