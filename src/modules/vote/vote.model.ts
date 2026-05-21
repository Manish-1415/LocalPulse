import mongoose from 'mongoose'

const voteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },

    type: {
      type: String,
      enum: ['upvote', 'downvote'],
      required: true
    }
  },
  {
    timestamps: true
  }
)

// compound unique index
// one user can only have ONE vote record per post
// trying to insert a second vote for same user+post throws duplicate error
// this enforces the one-vote-per-user rule at database level not just app level
voteSchema.index({ user: 1, post: 1 }, { unique: true })
//                                       ↑
//                              unique: true is the key part
//                              even if your service logic has a bug
//                              DB will never allow two votes from same user on same post

const Vote = mongoose.model('Vote', voteSchema)
export default Vote