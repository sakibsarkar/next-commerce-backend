import { Router } from "express";
import authMiddleWere from "../../middlewares/authMiddleWere";
import paymentController from "./payment.controller";
const router = Router();
router.post(
  "/create-payment-intent",
  authMiddleWere.isAuthenticateUser,
  paymentController.createPaymentIntent
);

const paymentRoute = router;
export default paymentRoute;
