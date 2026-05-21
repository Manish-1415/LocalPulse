export type CreateNotificationView = {
    recipient : string,
    triggeredBy : string,
    type : "upvote",
    post : string,
    read : boolean,
    message : string
}