"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validator_1 = require("../../middlewares/validator");
const book_controller_1 = require("./book.controller");
const book_validation_1 = __importDefault(require("./book.validation"));
const router = (0, express_1.Router)();
router.post("/", (0, validator_1.validSchema)(book_validation_1.default.create), book_controller_1.boockController.createBook);
router.get("/", book_controller_1.boockController.getBooks);
router.get("/:bookId", book_controller_1.boockController.getBookByBookId);
router.put("/:bookId", (0, validator_1.validSchema)(book_validation_1.default.update), book_controller_1.boockController.updateBookById);
router.delete("/:bookId", book_controller_1.boockController.deleteBookById);
const bookRute = router;
exports.default = bookRute;
