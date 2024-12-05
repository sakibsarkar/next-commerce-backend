import { z } from "zod";

const create = z.object({
  images: z.string().optional(), // Optional field with a default value
  description: z.string(),
  rating: z.number().min(1).max(5),
  orderId: z.string().uuid(),
});

const createReply = z.object({
  reviewId: z.string().uuid(),
  description: z.string(),
});

const reviewValidationSchema = {
  create,
  createReply,
};
export default reviewValidationSchema;
