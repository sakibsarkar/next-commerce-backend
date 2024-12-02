"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const create = zod_1.z.object({
    images: zod_1.z.string().optional(), // Optional field with a default value
    description: zod_1.z.string(),
    orderId: zod_1.z.string().uuid(),
});
const createReply = zod_1.z.object({
    reviewId: zod_1.z.string().uuid(),
    description: zod_1.z.string(),
});
const reviewValidationSchema = {
    create,
    createReply,
};
exports.default = reviewValidationSchema;
