import { Router } from "express";
import authMiddleWere from "../../middlewares/authMiddleWere";
import { validSchema } from "../../middlewares/validator";
import { productController } from "./product.controller";
import productValidationSchema from "./product.validation";
const router = Router();
router.post(
  "/create",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("VENDOR"),
  validSchema(productValidationSchema.create),
  productController.createProduct
);

router.post(
  "/duplicate/:productId",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("VENDOR"),
  productController.duplicateProduct
);

router.patch(
  "/update/:productId",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("VENDOR"),
  validSchema(productValidationSchema.update),
  productController.updateProduct
);

router.delete(
  "/remove/color/:colorId",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("VENDOR"),
  productController.removeColor
);
router.delete(
  "/remove/size/:sizeId",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("VENDOR"),
  productController.removeSize
);

router.delete(
  "/delete/:productId",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("VENDOR"),
  productController.deleteProductById
);

router.get("/get", productController.getProducts);
router.get("/get/:id", productController.getProductDetailsById);
router.post("/get-by-ids", productController.getProductsByIds);
router.get(
  "/my-shop",
  authMiddleWere.isAuthenticateUser,
  productController.getUsersShopProducts
);
router.get(
  "/get-related/:categoryId",
  productController.getRelatedProductsByCategoryId
);
router.get(
  "/shop-follow",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("CUSTOMER"),
  productController.getFollowedShopProducts
);

const productRoute = router;
export default productRoute;
