import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function getBaseUrl(): string {
    return (
        process.env.PUBLIC_VERCEL_URL ||
        `http://localhost:${process.env.PORT ?? 4321}`
    );
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
