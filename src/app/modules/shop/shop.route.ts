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

router.patch(
  "/update",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("VENDOR"),
  validSchema(shopValidationSchema.update),
  shopController.updateShop
);

router.get(
  "/my-shop",
  authMiddleWere.isAuthenticateUser,
  shopController.getShopByUser
);

router.get(
  "/get/:shopId",
  authMiddleWere.isAuthenticateUser,
  shopController.getSopInformationByShopId
);

router.get("/get-all", shopController.getAllShopsController);

router.patch(
  "/follow-unfollow/:shopId",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("CUSTOMER"),
  shopController.toggleFollowAShop
);

router.post(
  "/is-following",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("CUSTOMER"),
  shopController.isShopFollowedByUser
);

router.get(
  "/follower-count",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("CUSTOMER"),
  shopController.getShopFollowerCount
);

const shopRoute = router;
export default shopRoute;
