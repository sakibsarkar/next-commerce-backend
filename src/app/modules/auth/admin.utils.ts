import Config from "../../config";
import prisma from "../../config/prisma";
import authUtils from "./auth.utils";

const adminSeed = async () => {
  const admin = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
    },
  });

  if (admin) {
    return;
  }

  const password = await authUtils.hashPassword(Config.ADMIN_DEFAUL_PASS!);

  await prisma.user.create({
    data: {
      email: "admin@example.com",
      first_name: "admin",
      last_name: "admin",
      role: "ADMIN",
      password: password,
      isSuspended: false,
    },
  });
};

const adminUtils = {
  adminSeed,
};

export default adminUtils;
