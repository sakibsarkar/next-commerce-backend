import prisma from "../../config/prisma";
import { IShippingAddress } from "./shippingAddress.interface";

const createShippingAddress = async (
  payload: IShippingAddress,
  userId: string
) => {
  const shippingAddress = await prisma.shippingAddress.create({
    data: {
      ...payload,
      userId: userId,
    },
  });

  return shippingAddress;
};

const getShippingAddressByUser = async (userId: string) => {
  const shippingAddress = await prisma.shippingAddress.findMany({
    where: {
      userId: userId,
    },
  });
  return shippingAddress;
};
const shippingAddressService = {
  createShippingAddress,
  getShippingAddressByUser,
};

export default shippingAddressService;
