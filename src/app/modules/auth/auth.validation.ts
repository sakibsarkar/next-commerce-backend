import { z } from "zod";

const create = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    role: z.enum(["CUSTOMER", "ADMIN", "VENDOR"]).default("CUSTOMER"),
    image: z.string().url("Invalid image URL").optional(),
  })
  .strict();
const login = z
  .object({
    email: z.string({ message: "Email is required" }).email("Invalid email"),
    password: z.string({ message: "Password is required" }).min(6),
  })
  .strict();

const update = z
  .object({
    first_name: z.string({ message: "First name is required" }).optional(),
    last_name: z.string({ message: "Last name is required" }).optional(),
    phone_number: z.string({ message: "Phone number is required" }).optional(),
  })
  .strict()
  .partial();
const authValidation = {
  create,
  login,
  update,
};

export default authValidation;
