import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "embed.ts"),
            name: "CenraWidget",
            fileName: "widget",
            formats: ["iife"],
        },
        rollupOptions: {
            output: {
                extend: true,
            },
        },
    },
    server: {
        port: 3002,
        open:"/demo.html",
    },
});