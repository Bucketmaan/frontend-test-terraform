import axios, { AxiosHeaders } from "axios";

// Si VITE_API_BASE_URL est défini, on l'utilise, sinon on reste sur /api
const apiBaseUrl =
    (import.meta.env.VITE_API_BASE_URL
        ? `${import.meta.env.VITE_API_BASE_URL}/api`
        : "/api");

const client = axios.create({
    baseURL: apiBaseUrl,
});

client.interceptors.request.use((config) => {
    const headers = new AxiosHeaders(config.headers);
    headers.set("Accept", "*/*");
    headers.set("Content-Type", "application/json");

    config.headers = headers;
    return config;
});

export default client;