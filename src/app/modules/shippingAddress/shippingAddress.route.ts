import { Router } from "express";
import authMiddleWere from "../../middlewares/authMiddleWere";
import { validSchema } from "../../middlewares/validator";
import shippingAddressController from "./shippingAddress.controller";
import shippingAddressValidationSchema from "./shippingAddress.validation";
const router = Router();
router.post(
  "/create",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("CUSTOMER"),
  validSchema(shippingAddressValidationSchema.create),
  shippingAddressController.createShippingAddress
);

router.get(
  "/get",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("CUSTOMER"),
  shippingAddressController.getShippingAddressByUser
);

const shippingAddressRoute = router;
export default shippingAddressRoute;
