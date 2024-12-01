import { Router } from "express";
import authRoute from "../modules/auth/auth.route";

const router = Router();

const moduleRoute = [
  {
    path: "/auth",
    route: authRoute,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
