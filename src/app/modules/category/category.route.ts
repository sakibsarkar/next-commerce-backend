import { Router } from "express";
import authMiddleWere from "../../middlewares/authMiddleWere";
import categoryController from "./category.controller";
const router = Router();
router.post(
  "/create",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("ADMIN"),
  categoryController.createCategory
);

router.patch(
  "/update/:categoryId",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("ADMIN"),
  categoryController.updateCategory
);

router.get("/get", categoryController.getAllCategories);

const categoryRoute = router;
export default categoryRoute;
