import { v4 } from "uuid";

const generateTransactionId = () => {
  const timestamp = new Date().getTime();
  const uuid = v4();
  const lastFourDigits = uuid.slice(-4);
  return `TNX-${timestamp}-${lastFourDigits}`;
};
const getDiscountPrice = (price: number, discount: number = 0) => {
  return Math.round(price - (price * discount) / 100);
};
export const OrderUtils = {
  generateTransactionId,
  getDiscountPrice,
};
