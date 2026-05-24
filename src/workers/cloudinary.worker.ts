import { v2 as cloudinary } from "cloudinary";
import { Job, Worker } from "bullmq";
import { redis as redisConnectionConfig } from "../configs/redisClient.js";

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Missing required Cloudinary environment variables!");
}
// i have learned that throwing err earlier is easier & production grade.

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryFileDelete = () => {
  const worker: Worker = new Worker(
    "media-delete",
    async (job: Job) => {
      const result = await cloudinary.uploader.destroy(job.data.public_id);

      if (result.result !== "ok" && result.result !== "not found") {
        throw new Error(
          `Cloudinary API returned failure status: ${result.result}`
        );
      }
    },
    {
      connection: redisConnectionConfig,
    }
  );
  worker.on("completed", (job) => {
    console.log(`🎉 Background Job ${job.id} finished successfully!`);
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ Background Job ${job?.id} failed:`, err.message);
  });
};
