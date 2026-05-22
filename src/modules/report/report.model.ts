// models/report.model.js

import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    reason: {
      type: String,
      enum: ['spam', 'abuse', 'misinformation', 'inappropriate', 'other'],
      required: true
    },

    description: {
      type: String,
      maxlength: 300,
      default: null
      // optional — user can elaborate if reason is 'other'
    },

    status: {
      type: String,
      enum: ['pending', 'reviewed', 'dismissed'],
      default: 'pending'
      // pending  → sitting in admin queue
      // reviewed → admin took action (post removed)
      // dismissed → admin looked, found no violation
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
      // which admin/moderator reviewed this report
    },

    reviewedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

// one user can only report the same post once
// same pattern as Vote — enforced at DB level
reportSchema.index({ post: 1, reportedBy: 1 }, { unique: true })

// admin fetches pending reports sorted by newest
// this index makes that query instant
reportSchema.index({ status: 1, createdAt: -1 })

const Report = mongoose.model('Report', reportSchema)
export default Report