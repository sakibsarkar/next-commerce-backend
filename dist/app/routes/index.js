"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const author_route_1 = __importDefault(require("../modules/author/author.route"));
const book_route_1 = __importDefault(require("../modules/book/book.route"));
const borro_route_1 = __importDefault(require("../modules/borrow/borro.route"));
const member_route_1 = __importDefault(require("../modules/member/member.route"));
const return_route_1 = __importDefault(require("../modules/return/return.route"));
const router = (0, express_1.Router)();
const moduleRoute = [
    {
        path: "/author",
        route: author_route_1.default,
    },
    {
        path: "/books",
        route: book_route_1.default,
    },
    {
        path: "/members",
        route: member_route_1.default,
    },
    {
        path: "/borrow",
        route: borro_route_1.default,
    },
    {
        path: "/return",
        route: return_route_1.default,
    },
];
moduleRoute.forEach((route) => router.use(route.path, route.route));
exports.default = router;
