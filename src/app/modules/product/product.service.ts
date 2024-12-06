/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from "../../builder/QueryBuilder";
import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";

const createProduct = async (payload: any, user: any) => {
  // Find the shop associated with the user
  const shop = await prisma.shop.findUnique({
    where: {
      ownerId: user?.id,
    },
  });

  if (!shop) {
    throw new AppError(404, "Shop not found");
  }

  // Create the product
  const product = await prisma.product.create({
    data: {
      name: payload.name,
      price: payload.price,
      stock: payload.stock,
      discount: payload.discount,
      tag: payload.tag,
      description: payload.description,
      images: payload.images,
      categoryId: payload.categoryId,
      shopId: shop.id,
      colors: {
        create: payload.colors.map((color: any) => ({
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

const duplicateProduct = async (productId: string, userId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      colors: {
        include: {
          sizes: true,
        },
      },
      shopInfo: true,
    },
  });

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  if (product.shopInfo.ownerId !== userId) {
    throw new AppError(403, "You are not authorized to duplicate this product");
  }

  const newProduct = await prisma.product.create({
    data: {
      name: product.name,
      price: product.price,
      discount: product.discount,
      tag: product.tag,
      description: product.description,
      images: product.images,
      categoryId: product.categoryId,
      shopId: product.shopId,
      colors: {
        create: product.colors.map((color: any) => ({
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

  return newProduct;
};

const updateProduct = async (
  payload: any,
  productId: string,
  userId: string
) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      colors: true,
      shopInfo: true,
    },
  });

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  if (product.shopInfo.ownerId !== userId) {
    throw new AppError(403, "You are not authorized to update this product");
  }

  // Construct the data to update
  const updateData: any = {
    name: payload.name,
    price: payload.price,
    stock: payload.stock,
    discount: payload.discount,
    tag: payload.tag,
    description: payload.description,
    images: payload.images,
    categoryId: payload.categoryId,
    isSale: payload.isSale,
    // colors: {
    //   upsert: payload.colors.map((color: any) => ({
    //     where: { id: color.id },
    //     update: {
    //       color: color.color,
    //       sizes: {
    //         upsert: color.sizes.map((size: any) => ({
    //           where: { id: size.id },
    //           update: { quantity: size.quantity },
    //           create: {
    //             size: size.size,
    //             quantity: size.quantity,
    //           },
    //         })),
    //       },
    //     },
    //     create: {
    //       color: color.color,
    //       sizes: {
    //         create: color.sizes.map((size: any) => ({
    //           size: size.size,
    //           quantity: size.quantity,
    //         })),
    //       },
    //     },
    //   })),
    // },
  };

  // Update the product in the database
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: updateData,
  });

  return updatedProduct;
};
const removeColor = async (colorId: string, userId: string) => {
  const color = await prisma.color.findUnique({
    where: { id: colorId },
    include: { product: { include: { shopInfo: true } } },
  });

  if (!color) {
    throw new AppError(404, "Color not found");
  }

  // Check authorization
  if (color.product.shopInfo.ownerId !== userId) {
    throw new AppError(404, "You are not authorized to remove this color");
  }

  // Delete the color (and cascade delete associated sizes)
  await prisma.color.delete({
    where: { id: colorId },
  });

  return { message: "Color deleted successfully" };
};

const removeSize = async (sizeId: string, userId: string) => {
  const size = await prisma.size.findUnique({
    where: { id: sizeId },
    include: {
      color: { include: { product: { include: { shopInfo: true } } } },
    },
  });

  if (!size) {
    throw new AppError(404, "Size not found");
  }

  // Check authorization
  if (size.color.product.shopInfo.ownerId !== userId) {
    throw new AppError(404, "You are not authorized to remove this size");
  }

  // Delete the size
  await prisma.size.delete({
    where: { id: sizeId },
  });

  return { message: "Size deleted successfully" };
};

const deleteProductById = async (productId: string, userId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { shopInfo: true },
  });

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  if (product.shopInfo.ownerId !== userId) {
    throw new AppError(403, "You are not authorized to delete this product");
  }

  await prisma.product.update({
    where: { id: productId },
    data: { isDeleted: true },
  });
  return null;
};

const getAllProducts = async (query: Record<string, any>) => {
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;
  const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
  const categories = query.categories ? query.categories.split(",") : undefined;

  const explodedQueryParams = ["minPrice", "maxPrice", "categories"];

  explodedQueryParams.forEach((key) => delete query[key]);
  let findQuery: Record<string, any> = {
    isDeleted: false,
  };

  if (maxPrice) {
    findQuery = { ...findQuery, price: { lte: maxPrice } };
  }

  if (minPrice) {
    findQuery = { ...findQuery, price: { gte: minPrice } };
  }

  if (categories) {
    findQuery = { ...findQuery, categoryId: { in: categories } };
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
      categoryInfo: true,
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
      isDeleted: false,
    },
    include: {
      colors: {
        include: {
          sizes: true,
        },
      },
      categoryInfo: true,
      shopInfo: true,
    },
  });
  return product;
};

const getProductsByIds = async (ids: string[]) => {
  const products = await prisma.product.findMany({
    where: {
      id: { in: ids },
      isDeleted: false,
    },
    include: {
      shopInfo: true,
      categoryInfo: true,
      colors: {
        include: {
          sizes: true,
        },
      },
    },
  });
  return products;
};

const getUsersShopProducts = async (
  userId: string,
  query: Record<string, any>
) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const result = await prisma.product.findMany({
    where: {
      shopInfo: {
        ownerId: userId,
      },
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      avgRating: true,
      categoryId: true,
      categoryInfo: true,
      price: true,
      createdAt: true,
      discount: true,
    },
    orderBy: {
      createdAt: "desc",
    },

    skip: (page - 1) * limit,
    take: limit,
  });

  const totalCount = await prisma.product.count({
    where: {
      shopInfo: {
        ownerId: userId,
      },
      isDeleted: false,
    },
  });

  const metaQuery = {
    page,
    limit,
    totalCount,
  };

  return { result, metaQuery };
};

const getRelatedProductsByCategoryId = async (categoryId: string) => {
  const limit = 10;
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId,
      isDeleted: false,
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

  if (relatedProducts.length < limit) {
    const randomProducts = await prisma.product.findMany({
      take: limit - relatedProducts.length,
      where: {
        isDeleted: false,
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
    return [...relatedProducts, ...randomProducts];
  }

  return relatedProducts;
};

const getFollowedShopProducts = async (userId: string, limit: number) => {
  const followedShops = await prisma.shopFollower.findMany({
    where: {
      userId: userId,
    },
    select: {
      shopId: true,
    },
  });

  const shopIds = followedShops.map((shopFollower) => shopFollower.shopId);

  if (shopIds.length === 0) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      shopId: { in: shopIds },
      isDeleted: false,
    },
    skip: 0,
    take: limit,
  });

  const shuffledProducts = products.sort(() => 0.5 - Math.random());
  return shuffledProducts;
};

const flashSaleProducts = async (query: Record<string, any>) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);

  const products = await prisma.product.findMany({
    where: {
      isDeleted: false,
      discount: { gt: 0 },
    },
    include: {
      shopInfo: true,
      categoryInfo: true,
      colors: {
        include: {
          sizes: true,
        },
      },
    },
    orderBy: {
      discount: "desc",
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const totalCount = await prisma.product.count({
    where: {
      isDeleted: false,
      discount: { gt: 0 },
    },
  });

  return { products, totalCount };
};

const productService = {
  createProduct,
  getAllProducts,
  getProductDetailsById,
  updateProduct,
  removeColor,
  removeSize,
  deleteProductById,
  getRelatedProductsByCategoryId,
  getFollowedShopProducts,
  duplicateProduct,
  getUsersShopProducts,
  getProductsByIds,
  flashSaleProducts,
};

export default productService;
