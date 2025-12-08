import axios, { AxiosHeaders } from "axios";

const client = axios.create({
    baseURL: "/api",
});

client.interceptors.request.use((config) => {
    const headers = new AxiosHeaders(config.headers);
    headers.set("Accept", "*/*");
    headers.set("Content-Type", "application/json");

    config.headers = headers;
    return config;
});

export default client;