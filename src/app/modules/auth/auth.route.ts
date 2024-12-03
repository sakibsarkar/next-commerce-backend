import { Router } from "express";
import { multerUpload } from "../../config/multer";
import authMiddleWere from "../../middlewares/authMiddleWere";
import { validSchema } from "../../middlewares/validator";
import authController from "./auth.controller";
import authValidation from "./auth.validation";
const router = Router();
router.post(
  "/signup",
  validSchema(authValidation.create),
  authController.signUp
);

router.post("/login", validSchema(authValidation.login), authController.login);
router.post(
  "/logout",
  authMiddleWere.isAuthenticateUser,
  authController.logout
);
router.get("/author", authMiddleWere.isAuthenticateUser, authController.author);
router.patch(
  "/update-profile",
  validSchema(authValidation.update),
  authMiddleWere.isAuthenticateUser,
  authController.updateProfile
);

router.put(
  "/update-profile-image",
  authMiddleWere.isAuthenticateUser,
  multerUpload.single("file"),
  authController.updateUserProfileImage
);

router.post("/refresh-token", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

router.put(
  "/change-password",
  authMiddleWere.isAuthenticateUser,
  authController.changePassword
);

const authRoute = router;
export default authRoute;
