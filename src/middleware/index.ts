import { createSupabaseServerInstance } from "@lib/supabase";
import { getUserById } from "@src/features/user/service/get-user-by-id";
import { defineMiddleware } from "astro:middleware";

const PATHS_TO_IGNORE = ["/ignore"];

export const onRequest = defineMiddleware(
    async ({ locals, cookies, url, request }, next) => {
        if (PATHS_TO_IGNORE.includes(url.pathname)) {
            return next();
        }
        const supabase = createSupabaseServerInstance({
            cookies,
            headers: request.headers,
        });

        const { data } = await supabase.auth.getUser();

        if (data.user) {
            const user = await getUserById({
                userId: data.user.id,
                email: data.user.email,
            });
            locals.user = {
                email: data.user.email,
                id: user.id,
            };
        }
        return next();
    },
);
