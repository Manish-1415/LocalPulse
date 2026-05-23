import Post from "../post.model.js"

// In this function the logic of trending posts lies in between.
export const calculateScore = (upvotes : number, downvotes : number, createdAt : any) => {
  const netVotes = upvotes - downvotes
  const hoursOld = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60)
  return netVotes / Math.pow(hoursOld + 2, 1.5)
}

// this function is what the cron job calls
// single responsibility — recalculate and persist scores
export const recalculateAllScores = async () => {
  const posts = await Post.find({ status: 'open' })

  const bulkOps = posts.map((post) => ({
    updateOne: {
      filter: { _id: post._id },
      update: {
        $set: {
          score: calculateScore(
            post.upvotes,
            post.downvotes,
            post.createdAt
          )
        }
      }
    }
  }))

  if (bulkOps.length > 0) {
    // bulkwrite expects array of operations, & insert,update or delete the DB entries.
    await Post.bulkWrite(bulkOps)
    console.log(`[SCORE] Updated ${bulkOps.length} posts`)
  }
}