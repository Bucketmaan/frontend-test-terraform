// JawgMap.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import Modal from "@mui/material/Modal";
import Button from "./Button";
import Marker from "./Marker";
import DetailSmoke from "./DetailSmoke";

import { createSmokeSpot, getSmokeSpots } from "../api/smoke";

const JAWG_API_KEY = import.meta.env.VITE_JAWG_API_KEY;

export default function JawgMap() {
    const [spotName, setSpotName] = useState("");
    const [smokerName, setSmokerName] = useState("");
    const [description, setDescription] = useState("");
    const [userLocation, setUserLocation] = useState(null);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [spots, setSpots] = useState([]);
    const [map, setMap] = useState(null);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [clickedLocation, setClickedLocation] = useState(null);

    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    // ---------------------------
    //   Initialisation de la MAP
    // ---------------------------
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
        setMap(map);

        const centerMapOn = ({ latitude, longitude }) => {
            setUserLocation({ latitude, longitude });

            map.flyTo({
                center: [longitude, latitude],
                zoom: 15,
            });

            new maplibregl.Marker({ color: "#007AFF" })
                .setLngLat([longitude, latitude])
                .setPopup(
                    new maplibregl.Popup().setHTML(
                        `<b>Vous êtes ici</b><br/>Lat: ${latitude.toFixed(
                            5
                        )}, Lng: ${longitude.toFixed(5)}`
                    )
                )
                .addTo(map);
        };

        const loadLocation = async () => {
            try {
                const loc = {
                    latitude: 48.8155,
                    longitude: 2.3626,
                };
                return centerMapOn(loc);
            } catch (err) {
                console.warn("Géo navigateur refusée, fallback IP.\n ", err);
            }
        };

        loadLocation();

        // Handle map click to add a pin
        const handleMapClick = (e) => {
            const { lng, lat } = e.lngLat;
            setClickedLocation({ latitude: lat, longitude: lng });
            setOpenAddModal(true);
        };

        map.on("click", handleMapClick);

        return () => {
            map.off("click", handleMapClick);
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // ---------------------------
    //   Chargement des spots
    // ---------------------------
    useEffect(() => {
        const fetchSpots = async () => {
            try {
                const items = await getSmokeSpots();
                setSpots(items);
            } catch (err) {
                console.error("Failed to load spots:", err);
            }
        };
        fetchSpots();
    }, []);

    // ---------------------------
    //   Ajouter un spot
    // ---------------------------
    const handleAddPoint = async () => {
        const location = clickedLocation || userLocation;

        if (!location) {
            alert(
                "Localisation indisponible. As-tu accepté la géolocalisation ?"
            );
            return;
        }

        const { latitude, longitude } = location;

        if (mapRef.current) {
            mapRef.current.flyTo({
                center: [longitude, latitude],
                zoom: 15,
            });
        }

        const newSpotPayload = {
            name: spotName || "Spot sans nom",
            smokerName,
            description,
            latitude,
            longitude,
        };

        try {
            const createdSpot = await createSmokeSpot(newSpotPayload);
            setSpots((prev) => [...prev, createdSpot]);
            setOpenAddModal(false);
            setSpotName("");
            setSmokerName("");
            setDescription("");
            setClickedLocation(null);
        } catch (err) {
            console.error("Failed to create spot:", err);
            alert("Impossible d'enregistrer ce spot. Réessaie plus tard.");
        }
    };

    const handleMarkerClick = useCallback((spot) => {
        setSelectedSpot(spot);
    }, []);

    const handleCloseSpotPopup = () => setSelectedSpot(null);

    // ---------------------------
    //        RENDER
    // ---------------------------
    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Modal
                open={openAddModal}
                onClose={() => {
                    setOpenAddModal(false);
                    setClickedLocation(null);
                }}
            >
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
                            placeholder="Nom du spot"
                            value={spotName}
                            onChange={(e) => setSpotName(e.target.value)}
                        />
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
                    <button
                        onClick={() => setOpenAddModal(false)}
                        style={{ marginLeft: 8 }}
                    >
                        Annuler
                    </button>
                </div>
            </Modal>

            <Marker map={map} spots={spots} onMarkerClick={handleMarkerClick} />

            <DetailSmoke spot={selectedSpot} onClose={handleCloseSpotPopup} />

            <div
                ref={mapContainerRef}
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
}
