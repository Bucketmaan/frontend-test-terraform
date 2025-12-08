import axios, { AxiosHeaders } from "axios";

const client = axios.create({
    baseURL: "/api/v1",
});

client.interceptors.request.use((config) => {
    console.log(client.defaults.baseURL + (config.url || ""));
    const headers = new AxiosHeaders(config.headers);
    headers.set("Accept", "*/*");
    headers.set("Content-Type", "application/json");

    config.headers = headers;
    return config;
});

export default client;