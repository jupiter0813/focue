import db from "@src/db";
import { userPurchases, users, type Plan } from "@src/db/schemas";
import { and, eq, isNull } from "drizzle-orm";

export type GetUserByIdParams = {
    userId: string;
    email: string | undefined;
};

export async function getUserById(params: GetUserByIdParams) {
    let user = await db.query.users.findFirst({
        where: eq(users.id, params.userId),
    });

    if (!user) {
        let plan: Plan = "FREE";
        if (params.email) {
            const userPurchase = await db
                .select()
                .from(userPurchases)
                .where(
                    and(
                        eq(userPurchases.stripeCustomerEmail, params.email),
                        isNull(userPurchases.userId),
                    ),
                )
                .limit(1);

            if (userPurchase.length > 0) {
                plan = userPurchase[0].plan;
                await db
                    .update(userPurchases)
                    .set({
                        userId: params.userId,
                    })
                    .where(eq(userPurchases.id, userPurchase[0].id));
            }
        }
        const [insertedUser] = await db
            .insert(users)
            .values({
                id: params.userId,
                plan,
                email: params.email,
            })
            .returning();

        user = insertedUser;
    }

    return user;
}
