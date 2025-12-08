import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "VITE_");
    const URL = env.VITE_API_URL || "http://localhost:3000/";

    console.info("API Url:", URL);

    return {
        plugins: [react()],
        server: {
            proxy: {
                "/api/v1": {
                    target: URL,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api\/v1/, "/smoke"),
                },
            },
        },
    };
});