import { Router } from "express";
import authRoute from "../modules/auth/auth.route";
import productRoute from "../modules/product/product.route";
import shopRoute from "../modules/shop/shop.route";

const router = Router();

const moduleRoute = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/product",
    route: productRoute,
  },
  {
    path: "/shop",
    route: shopRoute,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
