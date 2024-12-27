"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const couponCodeStatus = zod_1.z.object({
    couponCode: zod_1.z.string({ message: "Coupon code must be required as string" }),
    productIds: zod_1.z
        .array(zod_1.z.string({ message: "Product id must be required as string" }))
        .nonempty("Product IDs array cannot be empty"),
});
const couponValidationSchema = {
    couponCodeStatus,
};
exports.default = couponValidationSchema;
