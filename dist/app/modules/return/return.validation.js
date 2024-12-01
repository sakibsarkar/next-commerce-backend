"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnValidationSchema = void 0;
const zod_1 = require("zod");
exports.returnValidationSchema = zod_1.z.object({ borrowId: zod_1.z.string() });
