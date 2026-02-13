import { useState } from "react";
import { motion } from "framer-motion";

const COLORS = [
  { name: "Rojo", hex: "#FF6B6B" },
  { name: "Turquesa", hex: "#4ECDC4" },
  { name: "Celeste", hex: "#45B7D1" },
  { name: "Salmon", hex: "#FFA07A" },
  { name: "Menta", hex: "#98D8C8" },
  { name: "Amarillo", hex: "#F7DC6F" },
  { name: "Purpura", hex: "#BB8FCE" },
  { name: "Azul Cielo", hex: "#85C1E2" },
  { name: "Naranja", hex: "#F8B88B" },
  { name: "Verde", hex: "#52C9A8" },
  { name: "Rosa", hex: "#FF8C94" },
  { name: "Verde Claro", hex: "#A8E6CF" },
  { name: "Durazno", hex: "#FFD3B6" },
  { name: "Coral", hex: "#FFAAA5" },
  { name: "Rosa Fuerte", hex: "#FF8B94" },
  { name: "Azul Claro", hex: "#A8D8EA" },
  { name: "Lila", hex: "#AA96DA" },
  { name: "Rosa Pastel", hex: "#FCBAD3" },
  { name: "Crema", hex: "#FFFFD2" },
  { name: "Verde Lima", hex: "#A1DE93" },
];

export const ParticipantSetup = ({ onStart }) => {
  const [participantCount, setParticipantCount] = useState(2);
  const [participants, setParticipants] = useState(
    Array(2)
      .fill(null)
      .map((_, i) => ({ name: "", color: COLORS[i] })),
  );
  const [pointsMode, setPointsMode] = useState("rapido");
  const [showPointsModal, setShowPointsModal] = useState(false);

  const handleCountChange = (e) => {
    const count = parseInt(e.target.value);
    setParticipantCount(count);
    setParticipants(
      Array(count)
        .fill(null)
        .map((_, i) => ({
          name: participants[i]?.name || "",
          color: COLORS[i],
        })),
    );

    if (
      count === 2 &&
      (pointsMode === "premium" || pointsMode === "especial")
    ) {
      setPointsMode("rapido");
    }
  };

  const handleNameChange = (index, name) => {
    const updated = [...participants];
    updated[index].name = name;
    setParticipants(updated);
  };

  const handleStart = () => {
    const validParticipants = participants.filter((p) => p.name.trim());
    if (validParticipants.length < 2) {
      alert("Por favor, ingresa al menos 2 nombres de participantes");
      return;
    }

    const pointsDistribution = {
      rapido: [1],
      normal: [2, 1],
      premium: [3, 2, 1],
      especial: [5, 3, 2],
    };

    onStart(participants, pointsDistribution[pointsMode]);
  };

  const getPointsLabel = () => {
    const labels = {
      rapido: "⚡ Rápido (1 punto)",
      normal: "🏆 Normal (3 puntos)",
      premium: "💎 Premium (6 puntos)",
      especial: "🌟 Especial (10 puntos)",
    };
    return labels[pointsMode];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "40px",
        background: "linear-gradient(to bottom right, #fff9e6, #ffe6cc)",
        borderRadius: "20px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "10px",
          color: "#333",
        }}
      >
        🐝 La carrera de ABEHA
      </h1>
      <p
        style={{
          textAlign: "center",
          color: "#666",
          marginBottom: "30px",
          fontSize: "18px",
        }}
      >
        Configura los participantes y prepárate para volar
      </p>

      <div style={{ marginBottom: "30px" }}>
        <label
          style={{
            display: "block",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "15px",
          }}
        >
          Cantidad de Participantes
        </label>
        <select
          value={participantCount}
          onChange={handleCountChange}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "18px",
            border: "3px solid #FFD700",
            borderRadius: "10px",
            backgroundColor: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {Array.from({ length: 19 }, (_, i) => i + 2).map((num) => (
            <option key={num} value={num}>
              {num} participantes
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        {participants.map((participant, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "12px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: participant.color.hex,
                  flexShrink: 0,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                {participant.color.name}
              </span>
            </div>
            <input
              type="text"
              placeholder={`Participante ${index + 1}`}
              value={participant.name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              style={{
                padding: "8px",
                border: "2px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            />
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStart}
        style={{
          width: "100%",
          padding: "18px",
          background: "linear-gradient(to right, #FFD700, #FFA500)",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "24px",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease",
          marginBottom: "15px",
        }}
      >
        ¡Volar! 🐝
      </motion.button>

      <button
        onClick={() => setShowPointsModal(true)}
        style={{
          width: "100%",
          padding: "12px",
          background: "#fff",
          color: "#333",
          fontWeight: "bold",
          fontSize: "16px",
          border: "2px solid #FFD700",
          borderRadius: "10px",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      >
        ⚙️ Configurar Puntos Slack: {getPointsLabel()}
      </button>

      {showPointsModal && (
        <div
          onClick={() => setShowPointsModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "30px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              Configurar Puntos Slack
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "15px",
                  backgroundColor:
                    pointsMode === "rapido" ? "#FFD700" : "#f5f5f5",
                  border:
                    "3px solid " +
                    (pointsMode === "rapido" ? "#FFA500" : "#ddd"),
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: pointsMode === "rapido" ? "bold" : "normal",
                  transition: "all 0.3s ease",
                }}
              >
                <input
                  type="radio"
                  name="pointsMode"
                  value="rapido"
                  checked={pointsMode === "rapido"}
                  onChange={(e) => setPointsMode(e.target.value)}
                  style={{ cursor: "pointer" }}
                />
                <div>
                  <div style={{ fontSize: "16px" }}>⚡ Rápido</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    1° lugar: 1 punto
                  </div>
                </div>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "15px",
                  backgroundColor:
                    pointsMode === "normal" ? "#FFD700" : "#f5f5f5",
                  border:
                    "3px solid " +
                    (pointsMode === "normal" ? "#FFA500" : "#ddd"),
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: pointsMode === "normal" ? "bold" : "normal",
                  transition: "all 0.3s ease",
                }}
              >
                <input
                  type="radio"
                  name="pointsMode"
                  value="normal"
                  checked={pointsMode === "normal"}
                  onChange={(e) => setPointsMode(e.target.value)}
                  style={{ cursor: "pointer" }}
                />
                <div>
                  <div style={{ fontSize: "16px" }}>🏆 Normal</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    1°: 2pts, 2°: 1pt
                  </div>
                </div>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "15px",
                  backgroundColor:
                    pointsMode === "premium" ? "#FFD700" : "#f5f5f5",
                  border:
                    "3px solid " +
                    (pointsMode === "premium" ? "#FFA500" : "#ddd"),
                  borderRadius: "10px",
                  cursor: participantCount >= 3 ? "pointer" : "not-allowed",
                  fontWeight: pointsMode === "premium" ? "bold" : "normal",
                  transition: "all 0.3s ease",
                  opacity: participantCount >= 3 ? 1 : 0.5,
                }}
              >
                <input
                  type="radio"
                  name="pointsMode"
                  value="premium"
                  checked={pointsMode === "premium"}
                  onChange={(e) => setPointsMode(e.target.value)}
                  disabled={participantCount < 3}
                  style={{
                    cursor: participantCount >= 3 ? "pointer" : "not-allowed",
                  }}
                />
                <div>
                  <div style={{ fontSize: "16px" }}>💎 Premium</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    1°: 3pts, 2°: 2pts, 3°: 1pt
                  </div>
                </div>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "15px",
                  backgroundColor:
                    pointsMode === "especial" ? "#FFD700" : "#f5f5f5",
                  border:
                    "3px solid " +
                    (pointsMode === "especial" ? "#FFA500" : "#ddd"),
                  borderRadius: "10px",
                  cursor: participantCount >= 3 ? "pointer" : "not-allowed",
                  fontWeight: pointsMode === "especial" ? "bold" : "normal",
                  transition: "all 0.3s ease",
                  opacity: participantCount >= 3 ? 1 : 0.5,
                }}
              >
                <input
                  type="radio"
                  name="pointsMode"
                  value="especial"
                  checked={pointsMode === "especial"}
                  onChange={(e) => setPointsMode(e.target.value)}
                  disabled={participantCount < 3}
                  style={{
                    cursor: participantCount >= 3 ? "pointer" : "not-allowed",
                  }}
                />
                <div>
                  <div style={{ fontSize: "16px" }}>🌟 Especial</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    1°: 5pts, 2°: 3pts, 3°: 2pts
                  </div>
                </div>
              </label>
            </div>

            <button
              onClick={() => setShowPointsModal(false)}
              style={{
                width: "100%",
                padding: "15px",
                background: "linear-gradient(to right, #FFD700, #FFA500)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "18px",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Guardar
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
