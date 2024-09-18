/** @type {import("prettier").Config} */
export default {
    tabWidth: 4,
    printWidth: 80,
    proseWrap: "never",
    trailingComma: "all",
    singleQuote: false,
    semi: true,
    plugins: ["prettier-plugin-astro"],
    overrides: [
        {
            files: "*.astro",
            options: {
                parser: "astro",
            },
        },
    ],
};
