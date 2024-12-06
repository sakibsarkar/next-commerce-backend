import QueryBuilder from "../../builder/QueryBuilder";
import prisma from "../../config/prisma";

const toggleUserSuspension = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      isDeleted: false,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isSuspended: !user.isSuspended,
    },
  });
  return result;
};

const deleteUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

const toggleShopBlackListStatus = async (shopId: string) => {
  const shop = await prisma.shop.findUnique({
    where: {
      id: shopId,
    },
  });

  if (!shop) {
    throw new Error("Shop not found");
  }

  const result = await prisma.shop.update({
    where: {
      id: shopId,
    },
    data: {
      isBlackListed: !shop.isBlackListed,
    },
  });
  return result;
};

const getTransactionHistory = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query).paginate().sort().filter();
  const queryResult = queryBuilder.getPrismaQuery();
  const metaQuery = queryBuilder.getMetaQuery();

  const transactions = await prisma.payment.findMany(queryResult);
  const totalCount = await prisma.payment.count({
    where: queryResult.where || {},
  });

  return { transactions, totalCount, metaQuery };
};

const getSystemOverview = async () => {
  const totalActiveUser = await prisma.user.count({
    where: {
      isDeleted: false,
      isSuspended: false,
      role: "CUSTOMER",
    },
  });

  const totalActiveVendor = await prisma.user.count({
    where: {
      isDeleted: false,
      isSuspended: false,
      role: "VENDOR",
    },
  });

  const totalActiveShop = await prisma.shop.count({
    where: {
      isBlackListed: false,
    },
  });

  const totalPayment = await prisma.payment.count({
    where: {
      status: "SUCCESS",
    },
  });

  return {
    totalActiveUser,
    totalActiveVendor,
    totalActiveShop,
    totalPayment,
  };
};

const adminService = {
  toggleUserSuspension,
  deleteUser,
  toggleShopBlackListStatus,
  getTransactionHistory,
  getSystemOverview,
};

export default adminService;
