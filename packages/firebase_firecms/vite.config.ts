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
            name: "FireCMS Firebase",
            fileName: (format) => `index.${format}.js`,
        },
        target: "ESNEXT",
        sourcemap: true,
        minify: false,
        rollupOptions: {
            external: isExternal,
        },
    },
    resolve: {
        alias: {
            "@firecms/core": path.resolve(__dirname, "../firecms_core/src"),
            "@firecms/ui": path.resolve(__dirname, "../ui/src"),
            "@firecms/schema_inference": path.resolve(__dirname, "../schema_inference/src"),
            "@firecms/collection_editor": path.resolve(__dirname, "../collection_editor/src"),
            "@firecms/data_enhancement": path.resolve(__dirname, "../data_enhancement/src"),
            "@firecms/data_import": path.resolve(__dirname, "../data_import/src"),
            "@firecms/data_export": path.resolve(__dirname, "../data_export/src"),
            "@firecms/data_import_export": path.resolve(__dirname, "../data_import_export/src"),
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
