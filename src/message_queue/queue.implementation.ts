import { Queue } from "bullmq";

import {redis as redisConnectionConfig} from "../configs/redisClient.js";


export const mediaQueue = new Queue("media-queue", {
    connection : redisConnectionConfig,
    defaultJobOptions : {
        attempts : 3,
        backoff : {type : "exponential", delay : 1000},
        removeOnComplete : true,
        removeOnFail : false,
    }
});

