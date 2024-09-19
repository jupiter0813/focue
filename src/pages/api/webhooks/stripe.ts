import { stripe } from "@lib/stripe";
import db from "@src/db";
import type { Plan } from "@src/db/schemas";
import { saveUserPurchase } from "@src/features/user/service/save-user-purchase";
import { updateUserPlan } from "@src/features/user/service/update-user-role";
import type { APIRoute } from "astro";
import type Stripe from "stripe";

type Metadata = {
    userId?: string;
    plan: Plan;
};

export const POST: APIRoute = async ({ request }) => {
    const signature = request.headers.get("stripe-signature");
    console.log("signature", signature);

    if (!signature) {
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    const stripeSigningSecret = process.env.STRIPE_SIGNING_SECRET as string;
    try {
        const event = stripe.webhooks.constructEvent(
            await request.text(),
            signature,
            stripeSigningSecret,
        );

        const completedEvent = event.data.object as Stripe.Checkout.Session & {
            metadata: Metadata;
        };

        if (event.type === "checkout.session.completed") {
            const userId = completedEvent.metadata.userId;
            const plan = completedEvent.metadata.plan;
            const email =
                completedEvent.customer_email ||
                completedEvent.customer_details?.email ||
                "";
            const total = completedEvent.amount_total || 0;

            if (userId) {
                await db.transaction(async (db) => {
                    await saveUserPurchase(
                        {
                            userId,
                            plan,
                            email,
                            total,
                        },
                        db,
                    );
                    await updateUserPlan(
                        {
                            userId,
                            plan,
                        },
                        db,
                    );
                });
            } else {
                await saveUserPurchase({
                    userId,
                    plan,
                    email,
                    total,
                });
            }
        }
        return new Response(JSON.stringify({ success: true, error: null }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({
                success: false,
                error: (err as { message: string }).message,
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
};
