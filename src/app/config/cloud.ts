import { v2 as cloudinary } from "cloudinary";
import Config from ".";

cloudinary.config({
  cloud_name: Config.CN_CLOUD_NAME!,
  api_key: Config.CN_API_KEY!,
  api_secret: Config.CN_API_SECRET!,
});
export default cloudinary;
