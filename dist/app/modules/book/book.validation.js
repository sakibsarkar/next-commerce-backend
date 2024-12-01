"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const create = zod_1.z
    .object({
    title: zod_1.z.string(),
    genre: zod_1.z.string(),
    publishedYear: zod_1.z.number().int().min(0),
    totalCopies: zod_1.z.number().int().min(0),
    availableCopies: zod_1.z.number().int().min(0),
})
    .strict();
const update = zod_1.z
    .object({
    title: zod_1.z.string().optional(),
    genre: zod_1.z.string().optional(),
    publishedYear: zod_1.z.number().int().min(0).optional(),
    totalCopies: zod_1.z.number().int().min(0).optional(),
    availableCopies: zod_1.z.number().int().min(0).optional(),
})
    .strict();
const bookValidationSchema = {
    create,
    update,
};
exports.default = bookValidationSchema;
