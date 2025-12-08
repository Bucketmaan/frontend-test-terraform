import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "VITE_");
    const HOST = env.VITE_API_HOST || "api.example.com";
    const PORT = env.VITE_API_PORT || "443";
    const URL = env.VITE_API_URL || "http://api.example.com:3000/api";

    console.info("API Host:", HOST);
    console.info("API Port:", PORT);
    console.log("API Url:", URL);

    return {
        plugins: [react()],
        server: {
            proxy: {
                "/api": {
                    target: URL,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, "/smoke"),
                },
            },
        },
    };
});