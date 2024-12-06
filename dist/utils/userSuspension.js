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
exports.deleteSuspendedUsers = void 0;
const prisma_1 = __importDefault(require("../app/config/prisma"));
function deleteSuspendedUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        try {
            // Find and delete users meeting the criteria
            const usersToDelete = yield prisma_1.default.user.findMany({
                where: {
                    isSuspended: true,
                    isDeleted: false,
                    suspensionDate: {
                        lte: thirtyDaysAgo,
                    },
                },
            });
            if (usersToDelete.length > 0) {
                // Delete the users
                yield prisma_1.default.user.deleteMany({
                    where: {
                        id: { in: usersToDelete.map((user) => user.id) },
                    },
                });
                console.log(`${usersToDelete.length} user(s) deleted.`);
            }
            else {
                console.log("No suspended users to delete.");
            }
        }
        catch (error) {
            console.error("Error deleting suspended users:", error);
        }
    });
}
exports.deleteSuspendedUsers = deleteSuspendedUsers;
