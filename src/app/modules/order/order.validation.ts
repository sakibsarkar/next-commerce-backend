import { z } from "zod";

const create = z.object({
  paymentIntentId: z.string(),
  shippingAddressId: z.string(),
  orderItems: z.array(
    z
      .object({
        productId: z.string(),
        quantity: z.number(),
        sizeId: z.string(),
        colorId: z.string(),
      })
      .strict()
  ),
});

const orderValidationSchema = {
  create,
};
export default orderValidationSchema;
