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
    onStart(participants);
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
        }}
      >
        ¡Volar! 🐝
      </motion.button>
    </motion.div>
  );
};
