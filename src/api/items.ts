import client from "./client";

export async function getItems() {
    try {
        const response = await client.get("/items");
        return response.data;
    } catch (error) {
        console.error("Error fetching items:", error);
        throw error;
    }
}
