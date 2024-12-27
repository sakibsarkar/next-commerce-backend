import { Router } from "express";
import authMiddleWere from "../../middlewares/authMiddleWere";
import { validSchema } from "../../middlewares/validator";
import { couponController } from "./coupon.controller";
import couponValidationSchema from "./coupon.validation";
const router = Router();
router.post(
  "/get-coupon-by-code",
  authMiddleWere.isAuthenticateUser,
  validSchema(couponValidationSchema.couponCodeStatus),
  couponController.validCouponByCouponCodeByProductIds
);

const couponRoute = router;
export default couponRoute;
