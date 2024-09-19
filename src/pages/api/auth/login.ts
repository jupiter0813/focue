import { getBaseUrl } from "@lib/helpers";
import { createSupabaseServerInstance } from "@lib/supabase";
import { type Provider } from "@supabase/supabase-js";
import type { APIRoute } from "astro";

export const POST: APIRoute = async (context) => {
    const formData = await context.request.formData();
    const provider = formData.get("provider") as string;
    const baseUrl = getBaseUrl();

    const supabase = createSupabaseServerInstance({
        headers: context.request.headers,
        cookies: context.cookies,
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
            redirectTo: `${baseUrl}/api/auth/callback`,
        },
    });

    if (error) {
        return new Response(error.message, { status: 500 });
    }

    return context.redirect(data.url || "");
};
