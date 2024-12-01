import { Router } from "express";

import authMiddleWere from "../../middlewares/authMiddleWere";
import { validSchema } from "../../middlewares/validator";
import shopController from "./shop.controller";
import shopValidationSchema from "./shop.validation";

const router = Router();

router.post(
  "/create",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("VENDOR"),
  validSchema(shopValidationSchema.create),
  shopController.createShop
);

router.get(
  "/myshop",
  authMiddleWere.isAuthenticateUser,
  shopController.getShopByUser
);

const shopRoute = router;
export default shopRoute;
