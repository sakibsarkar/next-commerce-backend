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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("../src/app/routes/index"));
const config_1 = __importDefault(require("./app/config"));
const prisma_1 = __importDefault(require("./app/config/prisma"));
const error_1 = __importDefault(require("./app/middlewares/error"));
const not_found_1 = require("./app/middlewares/not-found");
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)({
    origin: [config_1.default.FRONTEND_URL],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", index_1.default);
app.get("/create", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield prisma_1.default.category.create({
        data: {
            label: "Example Category",
        },
    });
    const user = yield prisma_1.default.user.create({
        data: {
            email: "example@example",
            password: "12345678",
            role: "VENDOR",
            first_name: "example",
            last_name: "example",
            image: "https://example.com/image.jpg",
        },
    });
    const shop = yield prisma_1.default.shop.create({
        data: {
            name: "Example Shop",
            ownerId: user.id,
            logo: "https://example.com/logo.png",
        },
    });
    yield prisma_1.default.product.create({
        data: {
            name: "Example Product",
            price: 100.0,
            categoryId: category.id,
            shopId: shop.id,
            description: "Example Description",
            colors: {
                create: [
                    {
                        color: "Red",
                        sizes: {
                            create: [
                                { size: "S", quantity: 10 },
                                { size: "M", quantity: 15 },
                            ],
                        },
                    },
                    {
                        color: "Blue",
                        sizes: {
                            create: [{ size: "L", quantity: 20 }],
                        },
                    },
                ],
            },
        },
    });
    res.send({
        success: true,
        statusCode: 200,
        message: "Hello from server",
    });
}));
// 404 Handler
app.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma_1.default.product.findMany({
        include: {
            colors: {
                include: {
                    sizes: true,
                },
            },
            shopInfo: true,
        },
    });
    res.send({
        success: true,
        statusCode: 200,
        data: products,
        message: "Hello from server",
    });
}));
app.use(not_found_1.notFound);
app.use(error_1.default);
exports.default = app;
