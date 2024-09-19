import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schemas";
import env from "../../env";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
    connection: postgres.Sql | undefined;
};

export const connection =
    globalForDb.connection ??
    postgres(env.DATABASE_URL!, {
        max: env.DB_SEEDING ? 1 : undefined,
        onnotice: env.DB_SEEDING ? () => {} : undefined,
    });

if (env.NODE_ENV !== "production") globalForDb.connection = connection;

export const db = drizzle(connection, {
    schema,
    logger: true,
});

export type db = typeof db;

export default db;
