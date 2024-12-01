import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";
import { IShop } from "./shop.interface";

const createShop = async (payload: IShop, userId: string) => {
  const isExistShop = await prisma.shop.findUnique({
    where: {
      ownerId: userId,
    },
  });

  if (isExistShop) {
    throw new AppError(400, "Shop already exists");
  }

  const shop = await prisma.shop.create({
    data: {
      ...payload,
      ownerId: userId,
    },
  });
  return shop;
};


// const updateShop = async


const getShopByUser = async (userId: string) => {
  const shop = await prisma.shop.findUnique({
    where: {
      ownerId: userId,
    },
  });
  return shop;
};

const shopService = {
  createShop,
  getShopByUser,
};
export default shopService;
