import { Table, getTableName, sql } from "drizzle-orm";
import env from "../../../env";
import { db, connection } from "@src/db";
import * as schema from "../schemas";

if (!env.DB_SEEDING) {
    throw new Error('You must set DB_SEEDING to "true" when running seeds');
}

async function resetTable(db: db, table: Table) {
    return db.execute(
        sql.raw(`DROP TABLE IF EXISTS "${getTableName(table)}" CASCADE`),
    );
}

async function resetDrizzleMigrations(db: db) {
    return db.execute(
        sql.raw(`DROP TABLE IF EXISTS drizzle.__drizzle_migrations CASCADE`),
    );
}

async function main() {
    console.time("resetting tables");
    for (const table of [schema.userPurchases, schema.users]) {
        await resetTable(db, table);
    }
    await resetDrizzleMigrations(db);
    console.timeEnd("resetting tables");
    await connection.end();
}

main();
