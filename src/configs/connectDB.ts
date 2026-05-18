import mongoose from "mongoose";
import ApiError from "../utility/ApiError.js";

const connectWithDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}`);

    if (!conn)
      throw new ApiError(500, "Error Occurred while connecting with DB ❌");

    console.log("DB Connected Successfully ⚙️ ⚙️ ⚙️");

    console.log(`DB Name - ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export default connectWithDB;