import { Router } from "express";
import authMiddleWere from "../../middlewares/authMiddleWere";
import adminController from "./admin.controller";
const router = Router();
router.patch(
  "/toggle-suspension/:userId",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("ADMIN"),
  adminController.toggleUserSuspension
);

router.delete(
  "/delete-user/:userId",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("ADMIN"),
  adminController.deleteUser
);

router.patch(
  "/toggle-shop-blacklist/:shopId",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("ADMIN"),
  adminController.toggleShopBlackListStatus
);

router.get(
  "/transactions",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("ADMIN"),
  adminController.getTransactionHistory
);

router.get(
  "/system-overview",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("ADMIN"),
  adminController.getSystemOverview
);
router.get(
  "/vendor-user-chart-data",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("ADMIN"),
  adminController.getVendorAndUserData
);

router.get(
  "/transaction-data",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("ADMIN"),
  adminController.getMonthlyTransactionOfCurrentYear
);

router.get(
  "/user-list",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("ADMIN"),
  adminController.getAllUserList
);
router.get(
  "/shop-list",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("ADMIN"),
  adminController.getAllShopList
);

const adminRoute = router;
export default adminRoute;
