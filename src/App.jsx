import { useState } from "react";
import { ParticipantSetup } from "./components/ParticipantSetup";
import { RaceTrack } from "./components/RaceTrack";

function App() {
  const [gameState, setGameState] = useState("setup");
  const [participants, setParticipants] = useState([]);

  const handleStart = (selectedParticipants) => {
    setParticipants(selectedParticipants);
    setGameState("racing");
  };

  const handleReset = () => {
    setGameState("setup");
    setParticipants([]);
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      {gameState === "setup" ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "20px",
            background: "linear-gradient(135deg, #1a2e1a 0%, #2d5a2d 100%)",
          }}
        >
          <ParticipantSetup onStart={handleStart} />
        </div>
      ) : (
        <RaceTrack participants={participants} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;
