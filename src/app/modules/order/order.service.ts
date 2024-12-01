import prisma from "../../config/prisma";
import stripe from "../../config/stripe";
import AppError from "../../errors/AppError";
import { IOrderPayload } from "./order.interface";
import { OrderUtils } from "./order.utils";

const createOrder = async (
  payload: IOrderPayload[],
  userId: string,
  paymentMethodId: string
) => {
  let totalAmount = 0;

  await prisma.$transaction(async (tx) => {
    payload.forEach(async (item) => {
      const product = await tx.product.findUnique({
        where: {
          id: item.productId,
        },
        include: {
          colors: {
            include: {
              sizes: true,
            },
          },
        },
      });

      if (!product) {
        throw new AppError(404, "Product not found");
      }

      const color = product.colors.find((color) => color.id === item.colorId);

      if (!color) {
        throw new AppError(404, "Color not found");
      }

      const size = color.sizes.find((size) => size.id === item.sizeId);

      if (!size) {
        throw new AppError(404, "Size not found");
      }

      if (size.quantity < item.quantity) {
        throw new AppError(
          400,
          `Insufficient quantity for size:${size.size} of color:${color.color} of product ${product.name}`
        );
      }
      await prisma.order.create({
        data: {
          userId: userId,
          shopId: product.shopId,
          productId: product.id,
          color: color.color,
          size: size.size,
          quantity: item.quantity,
        },
      });
      totalAmount += product.price * item.quantity;
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
    });
    const tnxId = OrderUtils.generateTransactionId();
    if (paymentIntent.status !== "succeeded") {
      await prisma.payment.create({
        data: {
          userId: userId,
          transactionId: tnxId,
          status: "FAILED",
        },
      });

      throw new AppError(400, "Payment failed");
    }
  });

  return totalAmount;
};
