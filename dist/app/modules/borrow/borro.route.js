"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validator_1 = require("../../middlewares/validator");
const borrow_controller_1 = require("./borrow.controller");
const borrow_validation_1 = require("./borrow.validation");
const router = (0, express_1.Router)();
router.get("/overdue", borrow_controller_1.borrowController.borrowOverDueList);
router.post("/", (0, validator_1.validSchema)(borrow_validation_1.borrowBookValidation), borrow_controller_1.borrowController.createBorrow);
const borrowRoute = router;
exports.default = borrowRoute;
