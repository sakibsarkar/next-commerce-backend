import QueryBuilder from "../../builder/QueryBuilder";
import prisma from "../../config/prisma";

const getAllCategories = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query)
    .paginate()
    .sort()
    .filter()
    .search(["label"]);
  const queryResult = queryBuilder.getPrismaQuery();
  const metaQuery = queryBuilder.getMetaQuery();

  const totalCount = await prisma.category.count({
    where: queryResult.where || {},
  });

  const result = await prisma.category.findMany({ ...queryResult });
  return { result, totalCount, metaQuery };
};

const createCategory = async (data: { label: string }) => {
  const result = await prisma.category.create({ data });
  return result;
};

const categoryService = { getAllCategories, createCategory };
export default categoryService;
