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
const http_1 = __importDefault(require("http"));
const node_cron_1 = __importDefault(require("node-cron"));
const app_1 = __importDefault(require("./app"));
const prisma_1 = __importDefault(require("./app/config/prisma"));
const admin_utils_1 = __importDefault(require("./app/modules/auth/admin.utils"));
const userSuspension_1 = require("./utils/userSuspension");
const port = process.env.PORT || 5000;
const server = http_1.default.createServer(app_1.default);
const appServer = server.listen(port);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.$connect();
        const categories = [
            { id: "550e8400-e29b-41d4-a716-446655440010", label: "Men's Clothing" },
            { id: "550e8400-e29b-41d4-a716-446655440011", label: "Women's Clothing" },
            {
                id: "550e8400-e29b-41d4-a716-446655440012",
                label: "Children's Clothing",
            },
            { id: "550e8400-e29b-41d4-a716-446655440013", label: "Footwear" },
            { id: "550e8400-e29b-41d4-a716-446655440014", label: "Accessories" },
            { id: "550e8400-e29b-41d4-a716-446655440015", label: "Sportswear" },
            { id: "550e8400-e29b-41d4-a716-446655440016", label: "Formal Wear" },
            { id: "550e8400-e29b-41d4-a716-446655440017", label: "Outerwear" },
            { id: "550e8400-e29b-41d4-a716-446655440018", label: "Sleepwear" },
            { id: "550e8400-e29b-41d4-a716-446655440019", label: "Swimwear" },
        ];
        function insertCategories() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    for (const category of categories) {
                        yield prisma_1.default.category.create({
                            data: {
                                id: category.id,
                                label: category.label,
                            },
                        });
                        console.log(`Inserted category: ${category.label}`);
                    }
                    console.log("All categories inserted successfully!");
                }
                catch (error) {
                    console.error("Error inserting categories:", error);
                }
                finally {
                    yield prisma_1.default.$disconnect();
                }
            });
        }
        // insertCategories();
        yield admin_utils_1.default.adminSeed();
        node_cron_1.default.schedule("0 0 * * *", () => {
            console.log("Running cron job to delete suspended users...");
            (0, userSuspension_1.deleteSuspendedUsers)();
        });
        console.log("database connnected", port);
    }
    catch (error) {
        console.log("database connnected", error);
        appServer.close(() => {
            process.exit(1);
        });
    }
});
startServer();
