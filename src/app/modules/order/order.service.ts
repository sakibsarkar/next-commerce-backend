import QueryBuilder from "../../builder/QueryBuilder";
import prisma from "../../config/prisma";
import stripe from "../../config/stripe";
import AppError from "../../errors/AppError";
import { IOrderPayload } from "./order.interface";
import { OrderUtils } from "./order.utils";

const createOrder = async (
  orderItems: IOrderPayload[],
  userId: string,
  paymentIntentId: string,
  shippingAddressId: string,
  couponCode?: string
) => {
  if (!paymentIntentId) {
    throw new AppError(400, "Payment method id is required");
  }

  let totalAmount = 0;
  const tnxId = OrderUtils.generateTransactionId();
  const productPriceHash: Record<string, { discount: number; price: number }> =
    {}; // { productId: {discout:number, price:number} }

  await prisma.$transaction(async (tx) => {
    for (const item of orderItems) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        include: { colors: { include: { sizes: true } } },
      });

      if (!product) throw new AppError(404, "Product not found");
      productPriceHash[product.id] = {
        discount: product.discount,
        price: product.price,
      };
      const color = product.colors.find((color) => color.id === item.colorId);
      if (!color) throw new AppError(404, "Color not found");

      const size = color.sizes.find((size) => size.id === item.sizeId);
      if (!size) throw new AppError(404, "Size not found");

      if (size.quantity < item.quantity) {
        throw new AppError(
          400,
          `Insufficient quantity for size:${size.size} of color:${color.color} of product ${product.name}. Only ${size.quantity} available but requested ${item.quantity}`
        );
      }

      const grandPrice = product.discount
        ? OrderUtils.getDiscountPrice(product.price, product.discount)
        : product.price;

      await tx.order.create({
        data: {
          userId,
          shopId: product.shopId,
          productId: product.id,
          color: color.color,
          size: size.size,
          shippingId: shippingAddressId,
          quantity: item.quantity,
          total: Math.round(grandPrice),
        },
      });

      await tx.size.update({
        where: { id: size.id },
        data: { quantity: size.quantity - item.quantity },
      });

      totalAmount += grandPrice * item.quantity;
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const paymentStatus =
      paymentIntent.status === "succeeded" ? "SUCCESS" : "FAILED";

    const paymentAmount = paymentIntent.amount / 100;
    await tx.payment.create({
      data: {
        userId,
        transactionId: tnxId,
        status: paymentStatus,
        amount: Math.round(totalAmount * 100),
      },
    });

    if (couponCode) {
      const productIds = orderItems.map((item) => item.productId);
      const coupon = await tx.coupon.findFirst({
        where: { code: couponCode, productId: { in: productIds } },
      });

      if (coupon) {
        const couponAppliedProduct = productPriceHash[coupon.productId];
        const product = orderItems.find(
          (item) => item.productId === coupon.productId
        );

        if (couponAppliedProduct && product) {
          const productDiscountPrice = OrderUtils.getDiscountPrice(
            couponAppliedProduct.price,
            couponAppliedProduct.discount || 0
          );

          // calculate te discount price for the product with quantity
          const discountPrice =
            productDiscountPrice * product.quantity * (coupon.discount / 100);
          totalAmount -= discountPrice;
        }
      }
    }

    if (paymentStatus !== "SUCCESS") {
      throw new AppError(400, "Payment failed");
    }

    if (Math.abs(paymentAmount - totalAmount) > 10) {
      // 10 is the tolerance
      throw new AppError(
        400,
        `Payment amount does not match total amount totalAmount:${totalAmount} paymentAmount:${paymentAmount}`
      );
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
      shippingInfo: true,
      shopInfo: {
        select: {
          name: true,
          logo: true,
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
      shippingInfo: true,
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

const moveOrderForShipment = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { shopInfo: true },
  });

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  if (order.shopInfo.ownerId !== userId) {
    throw new AppError(403, "You are not authorized to move this Order");
  }

  const result = await prisma.order.update({
    where: { id: orderId },
    data: { status: "ON_SHIPMENT" },
  });

  return result;
};

const orderService = {
  createOrder,
  getUserOrders,
  getVendorOders,
  moveOrderForShipment,
};

export default orderService;
