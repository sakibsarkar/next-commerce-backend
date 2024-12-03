import catchAsyncError from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import stripe from "../../config/stripe";

const createPaymentIntent = catchAsyncError(async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const { client_secret } = await stripe.paymentIntents.create({
    amount: Number(amount * 100),
    currency: "usd",
    payment_method_types: ["card"],
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: {
      client_secret,
    },
    message: "Payment intent created successfully",
  });
});

const paymentController = { createPaymentIntent };
export default paymentController;
