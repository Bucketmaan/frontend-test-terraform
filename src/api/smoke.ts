import client from "./client";
type SmokeSpot = {
    name: string,
    description: string,
    smoker: string,
    longitude: number,
    latitude: number
}

export async function getSmokeSpots() {
    try {
        console.log(client.defaults.baseURL + "/smoke");
        const response = await client.get("/smoke");
        return response.data;
    } catch (error) {
        console.error("Error fetching items:", error);
        throw error;
    }
}

export async function createSmokeSpot(body: SmokeSpot){
    try {
        const response = await client.post("/smoke", body);
        return response.data;
    } catch (error) {
        console.error("Error creating smoke spot:", error);
        throw error;
    } 
}

export async function deleteSmokeSpot(id: number){
    try {
        const response = await client.delete(`/smoke/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error creating smoke spot:", error);
        throw error;
    }  
}