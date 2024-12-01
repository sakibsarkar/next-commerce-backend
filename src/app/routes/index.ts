import { Router } from "express";
import authorRute from "../modules/author/author.route";
import bookRute from "../modules/book/book.route";
import borrowRoute from "../modules/borrow/borro.route";
import memberRoutes from "../modules/member/member.route";
import returnRoute from "../modules/return/return.route";

const router = Router();

const moduleRoute = [
  {
    path: "/author",
    route: authorRute,
  },
  {
    path: "/books",
    route: bookRute,
  },
  {
    path: "/members",
    route: memberRoutes,
  },
  {
    path: "/borrow",
    route: borrowRoute,
  },
  {
    path: "/return",
    route: returnRoute,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
