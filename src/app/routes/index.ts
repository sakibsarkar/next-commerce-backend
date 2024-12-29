import { Router } from "express";
import adminRoute from "../modules/admin/admin.route";
import authRoute from "../modules/auth/auth.route";
import categoryRoute from "../modules/category/category.route";
import couponRoute from "../modules/coupon/coupon.route";
import mockRoute from "../modules/mock.controller";
import newsLatterRoute from "../modules/newsLatter/newsLatter.route";
import orderRoute from "../modules/order/order.route";
import paymentRoute from "../modules/payment/payment.route";
import productRoute from "../modules/product/product.route";
import reviewRoute from "../modules/review/review.route";
import shippingAddressRoute from "../modules/shippingAddress/shippingAddress.route";
import shopRoute from "../modules/shop/shop.route";
import uploadRoute from "../modules/upload/upload.route";

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
  {
    path: "/order",
    route: orderRoute,
  },
  {
    path: "/review",
    route: reviewRoute,
  },
  {
    path: "/shipping-address",
    route: shippingAddressRoute,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
  {
    path: "/category",
    route: categoryRoute,
  },
  {
    path: "/upload",
    route: uploadRoute,
  },
  {
    path: "/admin",
    route: adminRoute,
  },
  {
    path: "/coupon",
    route: couponRoute,
  },
  {
    path: "/news-latter",
    route: newsLatterRoute,
  },
  {
    path: "/mock",
    route: mockRoute,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
