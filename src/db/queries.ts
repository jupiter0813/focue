import { and, eq, isNull } from "drizzle-orm";
import db from ".";
import { timers } from "./schemas";

export function createTimer({ userId }: { userId: string }) {
    return db
        .insert(timers)
        .values({
            userId,
            startedAt: new Date(),
            duration: 30,
        })
        .returning({
            id: timers.id,
        });
}

export function updateTimer(input: { timerId: number; userId: string }) {
    return db
        .update(timers)
        .set({
            stoppedAt: new Date(),
        })
        .where(
            and(eq(timers.id, input.timerId), eq(timers.userId, input.userId)),
        );
}

export function getActiveTimers({ userId }: { userId: string }) {
    return db
        .select()
        .from(timers)
        .where(and(eq(timers.userId, userId), isNull(timers.stoppedAt)));
}
