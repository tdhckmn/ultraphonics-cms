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
        target: "ESNEXT",
        modulePreload: false,
        cssCodeSplit: false,
        sourcemap: true,
        minify: false,
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "Formex",
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            external: isExternal,
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
