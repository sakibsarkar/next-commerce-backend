import { Router } from "express";
import { multerUpload } from "../../config/cloudinaryMulter.config";
import authMiddleWere from "../../middlewares/authMiddleWere";
import UploadController from "./upload.controller";
const router = Router();
router.post(
  "/single",
  authMiddleWere.isAuthenticateUser,
  multerUpload.single("file"),
  UploadController.uploadSingleFile
);
router.post(
  "/multiple",
  authMiddleWere.isAuthenticateUser,
  multerUpload.array("images"),
  UploadController.uploadMutilpleFile
);
const uploadRoute = router;
export default uploadRoute;
