// JawgMap.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import Modal from "@mui/material/Modal";
import Button from "./Button";
import Marker from "./Marker";
import DetailSmoke from "./DetailSmoke";
const JAWG_API_KEY =
  "ZcY8M0FxvuG5pICKPZLcT6IlPuiWJC1nJb6yPypgJvEPyQebKYMSdkxZzBU2OikP";

export default function JawgMap() {
  const [smokerName, setSmokerName] = useState("");
  const [description, setDescription] = useState("");
  const [userLocation, setUserLocation] = useState(null); // { latitude, longitude } | null
  const [openAddModal, setOpenAddModal] = useState(false);
  const [spots, setSpots] = useState([]); // list of { id, lat, lng, smokerName, description }
  const [selectedSpot, setSelectedSpot] = useState(null); // spot clicked on map

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null); // "Vous êtes ici" marker

  // Init map + geolocation on mount
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://tile.jawg.io/jawg-terrain.json?access-token=${JAWG_API_KEY}`,
      center: [2.3522, 48.8566],
      zoom: 12,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    // Geolocation: center on user and add "you are here" marker
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });

          map.flyTo({
            center: [longitude, latitude],
            zoom: 15,
          });

          const userMarker = new maplibregl.Marker({ color: "#007AFF" })
            .setLngLat([longitude, latitude])
            .setPopup(
              new maplibregl.Popup().setHTML(
                `<b>Vous êtes ici</b><br/>Lat: ${latitude.toFixed(
                  5
                )}, Lng: ${longitude.toFixed(5)}`
              )
            )
            .addTo(map);

          userMarkerRef.current = userMarker;
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Open/close add-spot modal
  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  // Add a new spot at user location
  const handleAddPoint = () => {
    if (!mapRef.current) return;

    if (!userLocation) {
      alert(
        "Localisation non disponible. Vérifie que tu as accepté la géolocalisation."
      );
      return;
    }

    const { latitude, longitude } = userLocation;

    mapRef.current.flyTo({
      center: [longitude, latitude],
      zoom: 15,
    });

    const newSpot = {
      id: Date.now(),
      lat: latitude,
      lng: longitude,
      smokerName,
      description,
    };

    setSpots((prev) => [...prev, newSpot]);

    setOpenAddModal(false);
    setDescription("");
    setSmokerName("");
  };

  const handleMarkerClick = useCallback((spot) => {
    setSelectedSpot(spot);
  }, []);

  const handleCloseSpotPopup = () => setSelectedSpot(null);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div   style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 2,
        }}>
      <Button
      
        label="Nouveau spot"
        handleButton={handleOpenAddModal}
      />
      </div>
       
     

      {/* Add-spot Modal */}
      <Modal open={openAddModal} onClose={handleCloseAddModal}>
        <div
          style={{
            padding: "16px",
            borderRadius: "10px",
            backgroundColor: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: 24,
            minWidth: 280,
          }}
        >
          <h2>Ajouter ce spot</h2>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 8,
              marginBottom: 12,
              marginTop: 8,
            }}
          >
            <input
              type="text"
              placeholder="Nom du fumeur"
              value={smokerName}
              onChange={(e) => setSmokerName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button onClick={handleAddPoint} disabled={!userLocation}>
            Ajouter à ma position
          </button>
          <button onClick={handleCloseAddModal} style={{ marginLeft: 8 }}>
            Annuler
          </button>
        </div>
      </Modal>

      {/* Marker layer (React component that manipulates MapLibre markers) */}
      <Marker
        map={mapRef.current}
        spots={spots}
        onMarkerClick={handleMarkerClick}
      />

      {/* Popup for a selected spot */}
      <DetailSmoke spot={selectedSpot} onClose={handleCloseSpotPopup} />

      {/* Map container */}
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
