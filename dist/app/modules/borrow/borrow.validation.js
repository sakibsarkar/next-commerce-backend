"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowBookValidation = void 0;
const zod_1 = require("zod");
exports.borrowBookValidation = zod_1.z.object({ bookId: zod_1.z.string(), memberId: zod_1.z.string() }).strict();
