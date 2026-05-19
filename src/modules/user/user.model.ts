import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false, //by using select false, whenever u query u wont get it
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    avatar: {
      url: {type: String},
      public_id: {type: String},
    },

    city: {
      type: String,
      trim: true,
    },

    reputation: {
      type: Number,
      default: 0, // goes up when your posts get upvoted
    },

    refreshToken: {
      type: String,
      default: null,
      select: false, // never returned in queries by default
    },
  },
  {
    timestamps: true,
  }
);

// depiction of single User entry
type UserSchemaProps = InferSchemaType<typeof userSchema>;

// use interface for adding method, simply added a method
export interface IUser extends UserSchemaProps {
  comparePassword(userPassword: string): Promise<boolean>;
}

userSchema.pre("save", async function() {
    if(!this.isModified("passwordHash")) return;

    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});


userSchema.methods.comparePassword = async function(this : IUser, userPassword : string) : Promise<boolean>{
    return await bcrypt.compare(userPassword, this.passwordHash);
}

// used the interface here so now when doc will created it will be the same shape of IUser
const User = mongoose.model<IUser>("User", userSchema);
export default User;

// this is just a convention