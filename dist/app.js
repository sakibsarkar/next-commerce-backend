"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("../src/app/routes/index"));
const error_1 = __importDefault(require("./app/middlewares/error"));
const not_found_1 = require("./app/middlewares/not-found");
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use("/api", index_1.default);
app.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({
        success: true,
        statusCode: 200,
        message: "Hello from server",
    });
}));
// 404 Handler
app.use(not_found_1.notFound);
app.use(error_1.default);
exports.default = app;
