import { z } from "zod";

const couponCodeStatus = z.object({
  couponCode: z.string({ message: "Coupon code must be required as string" }),
  productIds: z
    .array(z.string({ message: "Product id must be required as string" }))
    .nonempty("Product IDs array cannot be empty"),
});


const couponValidationSchema = {
  couponCodeStatus,
};
export default couponValidationSchema;