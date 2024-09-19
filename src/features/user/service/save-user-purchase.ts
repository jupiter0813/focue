import db from "@src/db";
import { userPurchases, type Plan } from "@src/db/schemas";

export type SaveUserPurchaseParams = {
    userId: string | undefined;
    plan: Plan;
    email: string;
    total: number;
};

export function saveUserPurchase(params: SaveUserPurchaseParams, _db: db = db) {
    return _db.insert(userPurchases).values({
        userId: params.userId,
        plan: params.plan,
        stripeCustomerEmail: params.email,
        total: params.total,
    });
}
