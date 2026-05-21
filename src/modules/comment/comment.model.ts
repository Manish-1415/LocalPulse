// models/comment.model.js

import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, 'Comment cannot be empty'],
      trim: true,
      minlength: 1,
      maxlength: 500
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true
      // this ties the comment to its parent post
      // when you query comments you filter by this field
    }
  },
  {
    timestamps: true
  }
)

// this index is critical
// every time frontend asks "give me comments for post X"
// MongoDB uses this index to find them instantly
// without it MongoDB scans every comment in the collection
commentSchema.index({ post: 1, createdAt: -1 })
//                          ↑           ↑
//                    filter by    then sort newest first

export const Comment = mongoose.model('Comment', commentSchema)