import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { coordinatesToAddress } from "../utils/Address";
import Button from "./Button";
/**
 * Props:
 * - spot: { id, lat, lng, smokerName, description } | null
 * - onClose: () => void
 */
export default function DetailSmoke({ spot, onClose }) {
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);
    useEffect(() => {
    if (!spot) {
      setAddress("");
      setAddressError("");
      setLoadingAddress(false);
      return;
    }

    setLoadingAddress(true);
    setAddressError("");

    coordinatesToAddress(spot.lat, spot.lng)
      .then((addr) => {
        setAddress(addr);
      })
      .catch((err) => {
        console.error(err);
        setAddressError("Impossible de récupérer l'adresse");
      })
      .finally(() => {
        setLoadingAddress(false);
      });
  }, [spot]);

  if (!spot) return null;

  return (
    <Modal open={!!spot} onClose={onClose}>
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
          minWidth: 250,
        }}
      >
         <h2>{spot.smokerName || "Spot"}</h2>
        <p>{spot.description || "Pas de description"}</p>

        <p style={{ marginTop: 8, fontStyle: 'italic', fontSize: '12px' }}>
          {loadingAddress && "Recherche de l'adresse..."}
          {!loadingAddress && addressError && (
            <span style={{ color: "red" }}>{addressError}</span>
          )}
          {!loadingAddress && !addressError && address && (
            <span>{address}</span>
          )}
          {!loadingAddress && !addressError && !address && (
            <span>Adresse inconnue</span>
          )}
        </p>
        <Button handleButton={onClose} label="Fermer"/>

      </div>
    </Modal>
  );
}
