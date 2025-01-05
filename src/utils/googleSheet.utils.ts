import { OAuth2Client } from "google-auth-library";
import { google, sheets_v4 } from "googleapis";
import { auth } from "../app";

const sheetHeading = ["tnxId", "orderId", "userId",  "amount", "date"];
export interface ISheetData {
  tnxId: string;
  orderId: string;
  userId: string;
  date: string;
  amount: number;
}

export const connectGoogleSheet = async (): Promise<sheets_v4.Sheets> => {
  const client = await auth.getClient();

  if (!(client instanceof OAuth2Client)) {
    throw new Error("Expected OAuth2Client");
  }

  const googleSheet = google.sheets({ version: "v4", auth: client });
  return googleSheet;
};

export const appendDataInSheet = async (sheetData: ISheetData) => {
  const googleSheet = await connectGoogleSheet();
  const spreadsheetId = "1I2m7AO5S2GtQqnIducdN-mqV4Gtu79LELHJ2r-IkjiU"

  const data = sheetHeading.map((head: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const value = sheetData[head];
    if (value === undefined || value === null) {
      return "UNKNOWN";
    }
    return value.toString();
  });

  try {
    const res = await googleSheet.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: `Sheet1!A2:B`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [data],
      },
    });

    return res;
  } catch (err) {
    console.error("Error appending data:", err);
    return null;
  }
};
