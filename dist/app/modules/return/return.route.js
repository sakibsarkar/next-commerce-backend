"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validator_1 = require("../../middlewares/validator");
const return_controller_1 = require("./return.controller");
const return_validation_1 = require("./return.validation");
const router = (0, express_1.Router)();
router.post("/", (0, validator_1.validSchema)(return_validation_1.returnValidationSchema), return_controller_1.returnController.returnBook);
const returnRoute = router;
exports.default = returnRoute;
