export async function coordinatesToAddress(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "SmokerSpotApp/1.0"
    }
  });

  if (!response.ok) {
    throw new Error("Failed reverse geocoding");
  }

  const data = await response.json();
  return data.display_name; // "12 Rue de Rivoli, Paris, France…"
}
