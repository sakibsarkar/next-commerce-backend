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
const updateCategory = async (data: { label: string }, categoryId: string) => {
  const isExist = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!isExist) {
    throw new Error("Category not found");
  }

  const result = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data,
  });
  return result;
};

const getFirstTenCategories = async () => {
  const result = await prisma.category.findMany({
    take: 10,
  });
  const category: Record<string, unknown>[] = [];

  for (const categoryItem of result) {
    const totalProduct = await prisma.product.count({
      where: { categoryId: categoryItem.id },
      orderBy: { createdAt: "desc" },
    });
    const data = {
      ...categoryItem,
      totalProduct,
    };
    category.push(data);
  }

  return category;
};

const categoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  getFirstTenCategories,
};
export default categoryService;
