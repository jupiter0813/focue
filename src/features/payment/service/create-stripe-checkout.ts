import { stripe } from "@lib/stripe";
import Stripe from "stripe";

type CreateStripeCheckoutProps = {
    metadata: Stripe.Metadata;
    priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData;
    successUrl: string;
    cancelUrl: string;
    mode: Stripe.Checkout.SessionCreateParams.Mode;
    email?: string;
};

export async function createStripeCheckout(props: CreateStripeCheckoutProps) {
    const stripeSession = await stripe.checkout.sessions.create({
        mode: props.mode,
        payment_method_types: ["card"],
        customer_email: props.email,
        line_items: [
            {
                quantity: 1,
                price_data: props.priceData,
            },
        ],
        metadata: props.metadata,
        success_url: props.successUrl,
        cancel_url: props.cancelUrl,
    });

    return { url: stripeSession.url };
}
