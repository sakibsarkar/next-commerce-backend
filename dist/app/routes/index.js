"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const mock_controller_1 = __importDefault(require("../modules/mock.controller"));
const order_route_1 = __importDefault(require("../modules/order/order.route"));
const product_route_1 = __importDefault(require("../modules/product/product.route"));
const review_route_1 = __importDefault(require("../modules/review/review.route"));
const shop_route_1 = __importDefault(require("../modules/shop/shop.route"));
const router = (0, express_1.Router)();
const moduleRoute = [
    {
        path: "/auth",
        route: auth_route_1.default,
    },
    {
        path: "/product",
        route: product_route_1.default,
    },
    {
        path: "/shop",
        route: shop_route_1.default,
    },
    {
        path: "/order",
        route: order_route_1.default,
    },
    {
        path: "/review",
        route: review_route_1.default,
    },
    {
        path: "/mock",
        route: mock_controller_1.default,
    },
];
moduleRoute.forEach((route) => router.use(route.path, route.route));
exports.default = router;
