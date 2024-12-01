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

const updateShop = async (userId: string, payload: Partial<IShop>) => {
  const shop = await prisma.shop.findUnique({
    where: {
      ownerId: userId,
    },
  });

  if (!shop) {
    throw new AppError(404, "Shop not found");
  }

  const updatedShop = await prisma.shop.update({
    where: {
      id: shop.id,
    },
    data: {
      ...payload,
    },
  });
  return updatedShop;
};

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
  updateShop,
};
export default shopService;
