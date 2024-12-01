"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const create = zod_1.z
    .object({
    name: zod_1.z.string(),
    logo: zod_1.z.string(),
    description: zod_1.z.string().optional(),
})
    .strict();
const update = zod_1.z
    .object({
    name: zod_1.z.string().optional(),
    logo: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
})
    .partial()
    .strict();
const shopValidationSchema = {
    create,
    update,
};
exports.default = shopValidationSchema;
