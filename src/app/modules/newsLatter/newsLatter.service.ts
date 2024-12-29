import QueryBuilder from "../../builder/QueryBuilder";
import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";

const createNewsLatter = async (email: string) => {
  const isExist = await prisma.newsLatter.findUnique({
    where: {
      email: email,
    },
  });
  if (isExist) {
    throw new AppError(409, `This email is already registered`);
  }

  const result = await prisma.newsLatter.create({
    data: {
      email: email,
    },
  });
  return result;
};

const getNewsLatters = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query)
    .sort()
    .paginate()
    .search(["email"]);
  const queryResult = queryBuilder.getPrismaQuery();
  const metaQuery = queryBuilder.getMetaQuery();

  const result = await prisma.newsLatter.findMany(queryResult);
  console.log(result);

  const totalCount = await prisma.newsLatter.count({
    where: queryResult.where || {},
  });

  return { result, totalCount, metaQuery };
};

const newsLatterService = { createNewsLatter, getNewsLatters };
export default newsLatterService;
