"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const create = zod_1.z.object({
    city: zod_1.z.string().min(1, "City is required"),
    zip_code: zod_1.z.string().min(1, "Zip code is required"),
    detailed_address: zod_1.z.string().min(1, "Detailed address is required"),
    phone: zod_1.z.string().min(1, "Phone number is required"),
});
const shippingAddressValidationSchema = {
    create,
};
exports.default = shippingAddressValidationSchema;
