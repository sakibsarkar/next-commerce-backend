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
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendDataInSheet = exports.connectGoogleSheet = void 0;
const google_auth_library_1 = require("google-auth-library");
const googleapis_1 = require("googleapis");
const app_1 = require("../app");
const sheetHeading = ["tnxId", "orderId", "userId", "amount", "date"];
const connectGoogleSheet = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield app_1.auth.getClient();
    if (!(client instanceof google_auth_library_1.OAuth2Client)) {
        throw new Error("Expected OAuth2Client");
    }
    const googleSheet = googleapis_1.google.sheets({ version: "v4", auth: client });
    return googleSheet;
});
exports.connectGoogleSheet = connectGoogleSheet;
const appendDataInSheet = (sheetData) => __awaiter(void 0, void 0, void 0, function* () {
    const googleSheet = yield (0, exports.connectGoogleSheet)();
    const spreadsheetId = "1I2m7AO5S2GtQqnIducdN-mqV4Gtu79LELHJ2r-IkjiU";
    const data = sheetHeading.map((head) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const value = sheetData[head];
        if (value === undefined || value === null) {
            return "UNKNOWN";
        }
        return value.toString();
    });
    try {
        const res = yield googleSheet.spreadsheets.values.append({
            auth: app_1.auth,
            spreadsheetId,
            range: `Sheet1!A2:B`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [data],
            },
        });
        return res;
    }
    catch (err) {
        console.error("Error appending data:", err);
        return null;
    }
});
exports.appendDataInSheet = appendDataInSheet;
