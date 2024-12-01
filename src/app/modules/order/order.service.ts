import QueryBuilder from "../../builder/QueryBuilder";
import Config from "../../config";
import prisma from "../../config/prisma";
import stripe from "../../config/stripe";
import AppError from "../../errors/AppError";
import { IOrderPayload } from "./order.interface";
import { OrderUtils } from "./order.utils";

const createOrder = async (
  payload: IOrderPayload[],
  userId: string,
  paymentMethodId: string,
  shippingAddressId: string
) => {
  if (!paymentMethodId) {
    throw new AppError(400, "Payment method id is required");
  }

  let totalAmount = 0;
  const tnxId = OrderUtils.generateTransactionId();

  await prisma.$transaction(async (tx) => {
    for (const item of payload) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        include: { colors: { include: { sizes: true } } },
      });

      if (!product) throw new AppError(404, "Product not found");

      const color = product.colors.find((color) => color.id === item.colorId);
      if (!color) throw new AppError(404, "Color not found");

      const size = color.sizes.find((size) => size.id === item.sizeId);
      if (!size) throw new AppError(404, "Size not found");

      if (size.quantity < item.quantity) {
        throw new AppError(
          400,
          `Insufficient quantity for size:${size.size} of color:${color.color} of product ${product.name}`
        );
      }

      await tx.order.create({
        data: {
          userId,
          shopId: product.shopId,
          productId: product.id,
          color: color.color,
          size: size.size,
          shippindId: shippingAddressId,
          quantity: item.quantity,
        },
      });

      await tx.size.update({
        where: { id: size.id },
        data: { quantity: size.quantity - item.quantity },
      });

      totalAmount += product.price * item.quantity;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "usd",
      // payment_method: paymentMethodId,
      return_url: Config.FRONTEND_URL || "http://localhost:3000",
      confirm: true,
    });

    const paymentStatus =
      paymentIntent.status === "succeeded" ? "SUCCESS" : "FAILED";
    await tx.payment.create({
      data: {
        userId,
        transactionId: tnxId,
        status: paymentStatus,
        amount: Math.round(totalAmount * 100),
      },
    });

    if (paymentStatus !== "SUCCESS") {
      throw new AppError(400, "Payment failed");
    }
  });

  return tnxId;
};

const getUserOrders = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const queryBuilder = new QueryBuilder(query).paginate().sort();
  const queryResult = queryBuilder.getPrismaQuery();
  const metaQuery = queryBuilder.getMetaQuery();

  const totalCount = await prisma.order.count({
    where: { userId },
  });

  const orders = await prisma.order.findMany({
    ...queryResult,
    include: {
      productInfo: {
        select: {
          id: true,
          price: true,
          name: true,
          images: true,
        },
      },
    },
  });

  return {
    orders,
    totalCount,
    metaQuery,
  };
};

const getVendorOders = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const shop = await prisma.shop.findUnique({
    where: { ownerId: userId },
  });

  if (!shop) {
    throw new AppError(404, "Shop not found");
  }

  const queryBuilder = new QueryBuilder(query).paginate().sort().filter();
  const queryResult = queryBuilder.getPrismaQuery({
    shopId: shop.id,
  });
  const metaQuery = queryBuilder.getMetaQuery();

  const totalCount = await prisma.order.count({
    where: queryResult.where || {},
  });

  const orders = await prisma.order.findMany({
    ...queryResult,

    include: {
      userInfo: true,
      shopInfo: true,
      productInfo: {
        select: {
          id: true,
          price: true,
          name: true,
          images: true,
        },
      },
    },
  });

  return {
    orders,
    totalCount,
    metaQuery,
  };
};

const orderService = {
  createOrder,
  getUserOrders,
  getVendorOders,
};

export default orderService;
