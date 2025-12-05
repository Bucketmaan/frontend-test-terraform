export default function Button({ handleButton, label }) {
  return (
    <button
      style={{
        padding: "6px 10px",
        borderRadius: 4,
        border: "none",
        background: "white",
        cursor: "pointer",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.3)",
      }}
      onClick={handleButton}
    >
      {label}
    </button>
  );
}
