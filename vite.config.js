import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "VITE_");
    const HOST = env.VITE_API_HOST || "api.example.com";
    const PORT = env.VITE_API_PORT || "443";

    console.info("API Host:", HOST);
    console.info("API Port:", PORT);

    return {
        plugins: [react()],
        server: {
            proxy: {
                "/api": {
                    target: `http://${HOST}:${PORT}`,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, "/smoke"),
                },
            },
        },
    };
});