"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const create = zod_1.z.object({
    paymentIntentId: zod_1.z.string(),
    shippingAddressId: zod_1.z.string(),
    orderItems: zod_1.z.array(zod_1.z
        .object({
        productId: zod_1.z.string(),
        quantity: zod_1.z.number(),
        sizeId: zod_1.z.string(),
        colorId: zod_1.z.string(),
    })
        .strict()),
});
const orderValidationSchema = {
    create,
};
exports.default = orderValidationSchema;
