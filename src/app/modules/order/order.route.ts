import { Router } from "express";
import authMiddleWere from "../../middlewares/authMiddleWere";
import { validSchema } from "../../middlewares/validator";
import orderController from "./order.controller";
import orderValidationSchema from "./order.validation";
const router = Router();
router.post(
  "/create",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("CUSTOMER"),
  validSchema(orderValidationSchema.create),
  orderController.createOrder
);

router.get(
  "/get-user",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("CUSTOMER"),
  orderController.getUserOrders
);
router.get(
  "/get-vendor",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("VENDOR"),
  orderController.getVendorOrders
);

router.put(
  "/move-to-shipment/:orderId",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("VENDOR"),
  orderController.moveOrderForShipment
);

const orderRoute = router;
export default orderRoute;
