// @ts-ignore
import path from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
const ReactCompilerConfig = {
    target: "18",
};
const isExternal = (id: string) => !id.startsWith(".") && !path.isAbsolute(id);

export default defineConfig(() => ({
    esbuild: {
        logOverride: { "this-is-undefined-in-esm": "silent" },
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "FireCMS",
            fileName: (format) => `index.${format}.js`,
        },
        target: "ESNEXT",
        minify: false,
        sourcemap: true,
        rollupOptions: {
            external: isExternal,
        },
    },
    resolve: {
        alias: {
            "@firecms/core": path.resolve(__dirname, "../firecms_core/src"),
            "@firecms/ui": path.resolve(__dirname, "../ui/src"),
            "@firecms/editor": path.resolve(__dirname, "../editor/src"),
        },
    },
    plugins: [
        react({
            babel: {
                plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
            },
        }),
    ],
}));
