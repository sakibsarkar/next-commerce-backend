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

router.get("/get", productController.getProducts);
router.get("/get/:id", productController.getProductDetailsById);

const productRoute = router;
export default productRoute;
