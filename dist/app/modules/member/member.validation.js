"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const create = zod_1.z
    .object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string(),
    membershipDate: zod_1.z.string().datetime(),
})
    .strict();
const update = zod_1.z
    .object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().optional(),
    membershipDate: zod_1.z.string().datetime().optional(),
})
    .strict();
const memberValidationSchema = {
    create,
    update,
};
exports.default = memberValidationSchema;
