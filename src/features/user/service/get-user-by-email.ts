import db from "@src/db";
import { users } from "@src/db/schemas";
import { eq } from "drizzle-orm";

export type GetUserByEmailParams= {
    email: string | undefined;
};

export async function getUserByEmail(params: GetUserByEmailParams) {
    if(!params.email) {
        return undefined;
    }
    let user = await db.query.users.findFirst({
        where: eq(users.email, params.email),
    });
    return user;
}