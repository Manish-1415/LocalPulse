import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
      // the user who RECEIVES the notification
      // not the one who triggered it
    },

    triggeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
      // the user whose action caused this notification
      // "Rahul upvoted your post" — Rahul is triggeredBy
    },

    type: {
      type: String,
      enum: ['upvote', 'comment', 'post_resolved'],
      required: true
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true
      // which post this notification is about
      // frontend uses this to navigate user to that post on click
    },

    read: {
      type: Boolean,
      default: false
      // false = unread, shows red dot on bell icon
      // true  = user has seen it
    },

    message: {
      type: String,
      required: true
      // pre-built message string, generated when notification is created
      // "Rahul Sharma upvoted your post"
      // "Priya commented on your post"
      // store it ready — don't build it at query time
    }
  },
  {
    timestamps: true
  }
)

// fetch all notifications for a user, unread first, newest first
// this is the exact query your GET /notifications route runs
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 })

// auto delete notifications older than 30 days
// notifications are not permanent records — they're alerts
// without this your collection grows forever
// MongoDB TTL index handles deletion automatically, no cron needed
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 }
)
//   ↑ TTL index — MongoDB checks this daily
//     any document where createdAt is older than 30 days gets deleted automatically
//     zero code needed, MongoDB handles it

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification