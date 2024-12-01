import { z } from "zod";

const create = z
  .object({
    name: z.string(),
    logo: z.string(),
    description: z.string().optional(),
  })
  .strict();

const update = z
  .object({
    name: z.string().optional(),
    logo: z.string().optional(),
    description: z.string().optional(),
  })
  .partial()
  .strict();

const shopValidationSchema = {
  create,
  update,
};
export default shopValidationSchema;
