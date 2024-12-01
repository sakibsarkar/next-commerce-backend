"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderUtils = void 0;
const uuid_1 = require("uuid");
const generateTransactionId = () => {
    const timestamp = new Date().getTime();
    const uuid = (0, uuid_1.v4)();
    const lastFourDigits = uuid.slice(-4);
    return `TNX-${timestamp}-${lastFourDigits}}`;
};
exports.OrderUtils = {
    generateTransactionId,
};
