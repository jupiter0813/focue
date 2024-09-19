import db from "@src/db";
import { users, type Plan } from "@src/db/schemas";
import { eq } from "drizzle-orm";

export type UpdateUserPlanParams = {
    userId: string;
    plan: Plan;
};

export function updateUserPlan(params: UpdateUserPlanParams, _db: db = db) {
    return _db
        .update(users)
        .set({ plan: params.plan })
        .where(eq(users.id, params.userId));
}
