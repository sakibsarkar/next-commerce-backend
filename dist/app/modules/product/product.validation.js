"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const sizeSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    size: zod_1.z.string().min(1, "Size is required"),
    quantity: zod_1.z.number().min(0, "Quantity must be at least 0"),
});
const colorSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    color: zod_1.z.string().min(1, "Color is required"),
    sizes: zod_1.z.array(sizeSchema).nonempty("At least one size is required"),
});
const create = zod_1.z
    .object({
    name: zod_1.z.string().min(1, "Product name is required"),
    price: zod_1.z.number().min(0, "Price must be at least 0"),
    stock: zod_1.z.number().optional().default(0),
    discount: zod_1.z.number().optional().default(0),
    tag: zod_1.z.string().optional().default(""),
    description: zod_1.z.string(),
    images: zod_1.z
        .array(zod_1.z.string().url("Each image must be a valid URL"))
        .nonempty("At least one image is required"),
    colors: zod_1.z.array(colorSchema).nonempty("At least one color is required"),
    categoryId: zod_1.z.string(),
})
    .strict();
const update = zod_1.z.object({
    name: zod_1.z.string().min(1, "Product name is required").optional(),
    price: zod_1.z.number().min(0, "Price must be at least 0").optional(),
    stock: zod_1.z.number().optional().default(0),
    discount: zod_1.z.number().optional().default(0),
    tag: zod_1.z.string().optional().default(""), // Optional
    description: zod_1.z.string().optional(),
    images: zod_1.z
        .array(zod_1.z.string().url("Each image must be a valid URL"))
        .nonempty("At least one image is required")
        .optional(),
    colors: zod_1.z
        .array(colorSchema)
        .nonempty("At least one color is required")
        .optional(),
    categoryId: zod_1.z.string().optional(),
});
const productValidationSchema = {
    create,
    update,
};
exports.default = productValidationSchema;
