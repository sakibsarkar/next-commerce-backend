import { Router } from "express";
import authMiddleWere from "../../middlewares/authMiddleWere";
import newsLatterController from "./newsLatter.controller";
const router = Router();
router.post("/create", newsLatterController.createNewsLatter);
router.get(
  "/get",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("ADMIN"),
  newsLatterController.getNewsLatters
);

const newsLatterRoute = router;
export default newsLatterRoute;
