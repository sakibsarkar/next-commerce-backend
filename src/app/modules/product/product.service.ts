/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from "../../builder/QueryBuilder";
import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";

const createProduct = async (body: any, user: any) => {
  const shop = await prisma.shop.findUnique({
    where: {
      ownerId: user?.id,
    },
  });

  if (!shop) {
    throw new AppError(404, "Shop not found");
  }

  const product = await prisma.product.create({
    data: {
      ...body,
      colors: {
        create: body.colors.map((color: any) => ({
          color: color.color,
          sizes: {
            create: color.sizes.map((size: any) => ({
              size: size.size,
              quantity: size.quantity,
            })),
          },
        })),
      },
    },
  });

  return product;
};

const getAllProducts = async (query: Record<string, any>) => {
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;
  const minPrice = query.minPrice ? Number(query.minPrice) : undefined;

  const explodedQueryParams = ["minPrice", "maxPrice"];

  explodedQueryParams.forEach((key) => delete query[key]);
  let findQuery: Record<string, any> = {};

  if (maxPrice) {
    findQuery = { ...findQuery, price: { lte: maxPrice } };
  }

  if (minPrice) {
    findQuery = { ...findQuery, price: { gte: minPrice } };
  }
  const queryBuilder = new QueryBuilder(query)
    .paginate()
    .filter()
    .sort()
    .search(["name", "description"]);

  const queryResult = queryBuilder.getPrismaQuery(findQuery);
  const metaQuery = queryBuilder.getMetaQuery();

  const products = await prisma.product.findMany({
    ...queryResult,
    include: {
      shopInfo: true,
      colors: {
        include: {
          sizes: true,
        },
      },
    },
  });
  const totalCount = await prisma.product.count({
    where: queryResult.where || {},
  });
  return { products, metaQuery, totalCount };
};

const getProductDetailsById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      colors: {
        include: {
          sizes: true,
        },
      },
      shopInfo: true,
    },
  });
  return product;
};

const productService = {
  createProduct,
  getAllProducts,
  getProductDetailsById,
};

export default productService;
