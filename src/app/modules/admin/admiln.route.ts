import { Router } from "express";
import authMiddleWere from "../../middlewares/authMiddleWere";
import adminController from "./admin.controller";
const router = Router();
router.patch(
  "/toggle-suspension/:userId",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("ADMIN")
);

router.delete(
  "/delete/:userId",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("ADMIN")
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
  "/transaction-data",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("ADMIN"),
  adminController.getMonthlyTransactionOfCurrentYear
);

const adminRoute = router;
export default adminRoute;
