import { Router } from "express";
import authMiddleWere from "../../middlewares/authMiddleWere";
import { validSchema } from "../../middlewares/validator";
import { couponController } from "./coupon.controller";
import couponValidationSchema from "./coupon.validation";
const router = Router();

router.post(
  "/create",
  authMiddleWere.isAuthenticateUser,
  couponController.createCoupon
);

router.post(
  "/get-coupon-by-code",
  authMiddleWere.isAuthenticateUser,
  validSchema(couponValidationSchema.couponCodeStatus),
  couponController.validCouponByCouponCodeByProductIds
);

router.get(
  "/get-coupon-list",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("ADMIN"),
  couponController.getCouponList
);

router.get(
  "/get-vendor-coupon",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("VENDOR"),
  couponController.getVendorCouponList
);

router.delete(
  "/delete/:couponId",
  authMiddleWere.isAuthenticateUser,
  couponController.deleteCouponCouponById
);

const couponRoute = router;
export default couponRoute;
