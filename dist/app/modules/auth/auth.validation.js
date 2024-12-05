"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const create = zod_1.z
    .object({
    first_name: zod_1.z.string().min(1, "First name is required"),
    last_name: zod_1.z.string().min(1, "Last name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
    role: zod_1.z.enum(["CUSTOMER", "VENDOR"]).optional(),
    image: zod_1.z.string().url("Invalid image URL").optional(),
})
    .strict();
const login = zod_1.z
    .object({
    email: zod_1.z.string({ message: "Email is required" }).email("Invalid email"),
    password: zod_1.z.string({ message: "Password is required" }).min(6),
})
    .strict();
const update = zod_1.z
    .object({
    first_name: zod_1.z.string({ message: "First name is required" }).optional(),
    last_name: zod_1.z.string({ message: "Last name is required" }).optional(),
    phone_number: zod_1.z.string({ message: "Phone number is required" }).optional(),
})
    .strict()
    .partial();
const authValidation = {
    create,
    login,
    update,
};
exports.default = authValidation;
