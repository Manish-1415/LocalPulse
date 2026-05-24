import cron from 'node-cron'
import { recalculateAllScores } from '../modules/post/post_utility/post_service.js'


export const initCronJobs = () => {
  cron.schedule('*/15 * * * *', async () => {
    console.log('[CRON] Running score recalculation...')
    await recalculateAllScores()
  })

  console.log('[CRON] Jobs registered')
}