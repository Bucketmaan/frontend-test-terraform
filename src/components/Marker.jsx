import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

/**
 * Props:
 * - map: MapLibre map instance
 * - spots: array of { id, name, description, createdAt, updatedAt, smoker, longitude, latitude }
 * - onMarkerClick: function(spot) => void
 */
export default function Marker({ map, spots, onMarkerClick }) {
  const markersRef = useRef([]);

  useEffect(() => {
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add markers for each spot
    spots.forEach((spot) => {
      console.log("Adding marker for spot:", spot);
      const marker = new maplibregl.Marker({ color: "#FF0000" })
        .setLngLat([spot.longitude, spot.latitude])
        .addTo(map);

      marker.getElement().addEventListener("click", () => {
        onMarkerClick(spot);
      });

      markersRef.current.push(marker);
    });

    // Cleanup when spots or map change/unmount
    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [map, spots, onMarkerClick]);

  return null; // no DOM
}
