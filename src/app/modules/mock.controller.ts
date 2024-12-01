import catchAsyncError from "../../utils/catchAsyncError";
import sendResponse from "../../utils/sendResponse";
import stripe from "../config/stripe";

import { Router } from "express";

const paymentIntent = catchAsyncError(async (_req, res) => {
  const paymentMethod = await stripe.paymentIntents.create({
    amount: 1099,
    currency: "usd",
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: paymentMethod.id,
    message: "Payment intent created successfully",
  });
});

const router = Router();

router.get("/payment-intent", paymentIntent);
const mockRoute = router;
export default mockRoute;
