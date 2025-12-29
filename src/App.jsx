import "./App.css";
import "maplibre-gl/dist/maplibre-gl.css";
import JawgMap from "./components/JawgMap";
function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <JawgMap />
    </div>
  );
}

export default App;
