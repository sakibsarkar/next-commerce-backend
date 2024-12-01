import Stripe from "stripe";
import Config from ".";

const stripe = new Stripe(Config.STRIPE_SECRET_KEY!);

export default stripe;
