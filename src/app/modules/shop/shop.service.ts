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

const toggleFollowAShop = async (shopId: string, userId: string) => {
  const isExistShop = await prisma.shop.findUnique({
    where: {
      id: shopId,
    },
  });

  if (!isExistShop) {
    const result = await prisma.shopFollower.deleteMany({
      where: {
        userId: userId,
        shopId: shopId,
      },
    });

    return result;
  }

  const isAlreadyFollowing = await prisma.shopFollower.findFirst({
    where: {
      userId: userId,
      shopId: shopId,
    },
  });

  if (isAlreadyFollowing) {
    throw new AppError(400, "You are already following this shop");
  }

  const follower = await prisma.shopFollower.create({
    data: {
      userId: userId,
      shopId: shopId,
    },
  });
  return follower;
};

const isShopFollowedByUser = async (shopId: string, userId: string) => {
  const follower = await prisma.shopFollower.findFirst({
    where: {
      userId: userId,
      shopId: shopId,
    },
  });
  return follower;
};

const getShopFollowerCount = async (shopId: string, userId: string) => {
  const followerCount = await prisma.shopFollower.count({
    where: {
      shopId: shopId,
    },
  });

  const isFollowing = await prisma.shopFollower.findFirst({
    where: {
      userId: userId,
      shopId: shopId,
    },
  });

  return {
    count: followerCount,
    isFollowing: Boolean(isFollowing),
  };
};

const shopService = {
  createShop,
  getShopByUser,
  updateShop,
  toggleFollowAShop,
  isShopFollowedByUser,
  getShopFollowerCount,
};
export default shopService;
