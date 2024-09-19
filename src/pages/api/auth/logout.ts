import { createSupabaseServerInstance } from "@lib/supabase";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies, request, redirect }) => {
    const supabase = createSupabaseServerInstance({
        cookies,
        headers: request.headers,
    });
    await supabase.auth.signOut();
    return redirect("/");
};
