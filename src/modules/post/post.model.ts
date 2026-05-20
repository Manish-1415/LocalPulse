import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100
    },

    body: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 2000
    },

    category: {
      type: String,
      enum: ['road', 'safety', 'event', 'civic', 'noise', 'other'],
      required: true
    },

    images: [{url : {type: String}, public_id : {type: String}}],  // cloudinary urls

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: {
        type: [Number],  // [longitude, latitude] — lng FIRST always
        required: true
      }
    },

    city : {type : String, required : true},

    upvotes: {type : Number, default : 0},
    downvotes: {type : Number, default : 0},

    score: {
      type: Number,
      default: 0        // recalculated every 15min by cron job
    },

    status: {
      type: String,
      enum: ['open', 'resolved', 'removed'],
      default: 'open'
    },

    tags: [String],

    commentCount: {
      type: Number,
      default: 0        // incremented when comment is added, no extra query needed
    }
  },
  {
    timestamps: true
  }
)

// This one line enables all $near geo queries
postSchema.index({ location: '2dsphere' })

// For sorting trending feed fast
postSchema.index({ score: -1 })

// For pagination
postSchema.index({ createdAt: -1 })

const Post = mongoose.model('Post', postSchema)
export default Post