import { z } from "zod";

const sizeSchema = z.object({
  size: z.string().min(1, "Size is required"),
  quantity: z.number().min(0, "Quantity must be at least 0"),
});

const colorSchema = z.object({
  color: z.string().min(1, "Color is required"),
  sizes: z.array(sizeSchema).nonempty("At least one size is required"),
});

const create = z
  .object({
    name: z.string().min(1, "Product name is required"),
    price: z.number().min(0, "Price must be at least 0"),
    brand: z.string().min(1, "Brand is required"),
    stock: z.number().optional().default(0),
    discount: z.number().optional().default(0),
    tag: z.string().optional().default(""),
    images: z
      .array(z.string().url("Each image must be a valid URL"))
      .nonempty("At least one image is required"),
    colors: z.array(colorSchema).nonempty("At least one color is required"),
    categoryId: z.string(),
  })
  .strict();

const productValidationSchema = {
  create,
};

export default productValidationSchema;
