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

const getVendorAndUserData = async () => {
  const userCounts = await prisma.user.groupBy({
    by: ["role"],
    where: {
      role: {
        in: ["VENDOR", "CUSTOMER"],
      },
    },
    _count: {
      role: true,
    },
  });

  // Calculate the total number of users
  const totalUsers = userCounts.reduce(
    (sum, user) => sum + user._count.role,
    0
  );

  // Map to percentage data
  const pieChartData = userCounts.map((user) => ({
    role: user.role,
    percentage: ((user._count.role / totalUsers) * 100).toFixed(2), // Convert to percentage
  }));

  return pieChartData;
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

  const result = await prisma.payment.findMany(queryResult);
  const totalCount = await prisma.payment.count({
    where: queryResult.where || {},
  });

  return { result, totalCount, metaQuery };
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

const getMonthlyTransactionOfCurrentYear = async () => {
  const currentYear = new Date().getFullYear();

  // Fetch successful transactions grouped by month
  const transactions = await prisma.payment.groupBy({
    by: ["status", "createdAt"],
    where: {
      status: "SUCCESS",
      createdAt: {
        gte: new Date(`${currentYear}-01-01`),
        lt: new Date(`${currentYear + 1}-01-01`),
      },
    },
    _sum: {
      amount: true,
    },
  });

  // Prepare data grouped by month
  const monthlyData = Array(12).fill(0); // 12 months initialized to 0
  transactions.forEach((transaction) => {
    const month = new Date(transaction.createdAt).getMonth(); // 0-indexed
    monthlyData[month] += transaction._sum.amount || 0;
  });

  return monthlyData;
};

const getAllUserList = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query)
    .paginate()
    .sort()
    .filter()
    .search(["first_name", "last_name", "email"]);

  const queryResult = queryBuilder.getPrismaQuery({
    isDeleted: false,
  });
  const metaQuery = queryBuilder.getMetaQuery();

  const result = await prisma.user.findMany(queryResult);
  const totalCount = await prisma.user.count({
    where: queryResult.where || {},
  });

  return { result, totalCount, metaQuery };
};
const getAllShopList = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query)
    .paginate()
    .sort()
    .filter()
    .search(["name"]);

  const defaultQuery: Record<string, unknown> = {};
  const isBlackListed = query.isBlackListed;
  if (isBlackListed) {
    if (isBlackListed == "1") {
      defaultQuery.isBlackListed = true;
    } else {
      defaultQuery.isBlackListed = false;
    }
  }
  delete query.isBlackListed;
  const queryResult = queryBuilder.getPrismaQuery(defaultQuery);
  const metaQuery = queryBuilder.getMetaQuery();

  const result = await prisma.shop.findMany(queryResult);
  const totalCount = await prisma.shop.count({
    where: queryResult.where || {},
  });

  return { result, totalCount, metaQuery };
};

const adminService = {
  toggleUserSuspension,
  deleteUser,
  toggleShopBlackListStatus,
  getTransactionHistory,
  getSystemOverview,
  getMonthlyTransactionOfCurrentYear,
  getVendorAndUserData,
  getAllUserList,
  getAllShopList,
};

export default adminService;
