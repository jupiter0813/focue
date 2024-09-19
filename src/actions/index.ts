import { getBaseUrl } from "@lib/helpers";
import { createStripeCheckout } from "@src/features/payment/service/create-stripe-checkout";
import { getPriceById } from "@src/features/payment/service/get-price-by-id";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
// https://docs.astro.build/en/guides/actions/
export const server = {
    getGreeting: defineAction({
        input: z.object({
            name: z.string(),
        }),
        handler: async (input) => {
            return `Hello, ${input.name}!`;
        },
    }),
    createCheckout: defineAction({
        input: z.object({
            priceId: z.string(),
        }),
        handler: async (input, context) => {
            const { user } = context.locals;

            const price = await getPriceById({ id: +input.priceId });

            if (!price) {
                throw new ActionError({
                    code: "NOT_FOUND",
                    message: "Price not found",
                });
            }

            const baseUrl = getBaseUrl();

            const metadata: Record<string, string> = {
                plan: price.plan,
            };

            if (user) {
                metadata.userId = user.id;
            }

            const session = await createStripeCheckout({
                successUrl: `${baseUrl}/success`,
                cancelUrl: `${baseUrl}/cancel`,
                mode: "payment",
                priceData: {
                    unit_amount: price.amount,
                    currency: "usd",
                    product_data: {
                        name: price.title,
                        description: "Description",
                    },
                },
                metadata: metadata,
                email: user?.email,
            });

            if (!session.url) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: "Failed to create checkout session",
                });
            }

            return {
                url: session.url,
            };
        },
    }),
};
