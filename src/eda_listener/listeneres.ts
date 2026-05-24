import type { tryCatch } from "bullmq";
import eventBus from "../configs/eda_implementation.js";
import notificationService from "../modules/notification/notification.services.js";
import type { CreateNotificationView } from "../modules/notification/notification.validation.js";
import { Types } from "mongoose";


// type VoteCreationView = {
//     recipient : string;
//     triggeredBy : string;
//     type : string;
//     post : string;
//     read : boolean;
//     message : string;
// }


eventBus.on("vote_created", async (payload : CreateNotificationView) => {
    try {
    await notificationService.createNotification(payload);
    } catch (error) {
        console.log(error);
    }
})


eventBus.on("comment_created", async (payload : CreateNotificationView) => {
    try {
        await notificationService.createNotification(payload);
    } catch (error) {
        console.log(error);
    }
})


eventBus.on("post_resolved", async ({userId, postId, commenters} : { userId : string, postId : string, commenters : string[]}) => { 
    try {
        const unresolvedPromises = commenters.map( (receiver) => {
        return notificationService.createNotification({
        recipient: receiver,
        triggeredBy: userId,
        type: "post_resolved",
        read: false,
        message: `An Issue U Engaged with Has been resolved`,
        post: postId,
        })
        })

        await Promise.all(unresolvedPromises);

    } catch (error) {
        console.log(error);
    }
})