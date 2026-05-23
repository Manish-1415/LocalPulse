import {redis} from "./redisClient.js"
import { scanKeys } from "./redisClient.js";

export const delFeedCache = async (lng : number, lat : number) => {
    const pattern = `feed:${lng}:${lat}:*`;
    const keysToDelete = await scanKeys(pattern);     

    if(keysToDelete.length > 0) {
        await redis.del(keysToDelete);
        console.log(`Feed Cache Removed by Keys - ${keysToDelete.length} for lat : ${lat} & lng :${lng}`);
    }
}

export const delResolvedCache = async (city : string) => {
  const pattern = `resolved_feed:${city}:*`
  const keysToDelete = await scanKeys(pattern);
  if (keysToDelete.length > 0) {
    await redis.del(keysToDelete)
    console.log(`[CACHE] Deleted ${keysToDelete.length} resolved keys for ${city}`)
  }
}