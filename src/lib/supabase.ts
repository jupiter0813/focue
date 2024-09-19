import {
    createServerClient,
    parseCookieHeader,
    type CookieOptionsWithName,
} from "@supabase/ssr";
import type { AstroCookies } from "astro";

export const cookieOptions: CookieOptionsWithName = {
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "lax",
};

export const createSupabaseServerInstance = (context: {
    headers: Headers;
    cookies: AstroCookies;
}) => {
    const supabase = createServerClient(
        process.env.PUBLIC_SUPABASE_URL!,
        process.env.PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookieOptions,
            cookies: {
                getAll() {
                    return parseCookieHeader(
                        context.headers.get("Cookie") ?? "",
                    );
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        context.cookies.set(name, value, options),
                    );
                },
            },
        },
    );

    return supabase;
};
