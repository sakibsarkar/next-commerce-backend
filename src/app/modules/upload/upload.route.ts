import { Router } from "express";
import { multerUpload } from "../../config/cloudinaryMulter.config";
import authMiddleWere from "../../middlewares/authMiddleWere";
import UploadController from "./upload.controller";
const router = Router();
router.post(
  "/single",
  multerUpload.single("file"),
  authMiddleWere.isAuthenticateUser,
  UploadController.uploadSingleFile
);

const uploadRoute = router;
export default uploadRoute;
