import { v4 } from "uuid";

const generateTransactionId = () => {
  const timestamp = new Date().getTime();
  const uuid = v4();
  const lastFourDigits = uuid.slice(-4);
  return `TNX-${timestamp}-${lastFourDigits}}`;
};

export const OrderUtils = {
  generateTransactionId,
};
