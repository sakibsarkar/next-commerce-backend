import { z } from "zod";

const create = z.object({
  city: z.string().min(1, "City is required"),
  zip_code: z.string().min(1, "Zip code is required"),
  detailed_address: z.string().min(1, "Detailed address is required"),
  phone: z.string().min(1, "Phone number is required"),
});

const shippingAddressValidationSchema = {
  create,
};
export default shippingAddressValidationSchema;
