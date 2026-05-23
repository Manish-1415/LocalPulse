export type CreateNotificationView = {
    recipient : string,
    triggeredBy : string,
    type : "upvote" | "comment" | "post_resolved",
    post : string,
    read : boolean,
    message : string
}