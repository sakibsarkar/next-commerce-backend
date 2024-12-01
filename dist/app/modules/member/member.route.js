"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validator_1 = require("../../middlewares/validator");
const member_controller_1 = require("./member.controller");
const member_validation_1 = __importDefault(require("./member.validation"));
const router = (0, express_1.Router)();
router.post("/", (0, validator_1.validSchema)(member_validation_1.default.create), member_controller_1.memberController.createMember);
router.get("/", member_controller_1.memberController.getMembers);
router.get("/:memberId", member_controller_1.memberController.getMemberByMemberId);
router.put("/:memberId", (0, validator_1.validSchema)(member_validation_1.default.update), member_controller_1.memberController.updateMember);
router.delete("/:memberId", member_controller_1.memberController.deleteMember);
const memberRoutes = router;
exports.default = memberRoutes;
