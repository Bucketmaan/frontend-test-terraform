import axios, { AxiosHeaders } from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

console.log("Using API:", baseURL);

const client = axios.create({
    baseURL,
});

client.interceptors.request.use((config) => {
    const headers = new AxiosHeaders(config.headers);
    headers.set("Accept", "*/*");
    headers.set("Content-Type", "application/json");
    config.headers = headers;
    return config;
});

export default client;