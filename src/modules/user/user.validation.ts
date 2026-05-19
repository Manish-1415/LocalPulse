import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  passwordHash: z.string().min(6), // The client sends "password", you hash it as "passwordHash"
  role: z.enum(["user", "admin"]).default("user"),
  avatar: z.object({
    url: z.string(),
    public_id: z.string(),
  }),
  city: z.string(),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  passwordHash: z.string(),
});



export const updateProfileSchema = z
  .object({
    name: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
    avatar: z
      .object({
        public_id: z.string().optional(),
        url: z.string().optional(),
      })
      .optional(),
    city: z.string().optional(),
  }).refine(
    (data) => {
      // Object.values(data) gives an array of the fields passed.
      // .some(...) checks if at least one of those fields is NOT undefined.
      return Object.values(data).some((value) => value !== undefined);
    },
    {
      // The custom message returned when validation fails
      message: "At least one field (name, email, avatar, or city) must be provided for an update.",
    }
  );


  export const updateUserPasswordSchema = z.object({
    newPassword : z.string(),
    oldPassword : z.string()
  })