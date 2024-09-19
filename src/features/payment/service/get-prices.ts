import type { Plan } from "@src/db/schemas";

export async function getPrices() {
    const data: { id: number; amount: number; title: string; plan: Plan }[] = [
        {
            id: 1,
            amount: 1000,
            title: "Basic",
            plan: "BASIC",
        },
        {
            id: 2,
            amount: 1500,
            title: "Platinum",
            plan: "PREMIUM",
        },
    ];
    return data;
}
