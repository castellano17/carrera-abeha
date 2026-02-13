import { useEffect } from "react";
import confetti from "canvas-confetti";

export const ResultsPodium = ({
  participants,
  finishOrder,
  onReset,
  onReplay,
  stats = [],
  pointsDistribution = [1],
}) => {
  useEffect(() => {
    confetti({
      particleCount: 250,
      spread: 120,
      origin: { y: 0.5 },
    });
  }, []);

  const participationOrder = [...finishOrder].reverse();

  // Función para obtener medalla o dato divertido
  const getFunFact = (participantIdx, position) => {
    const stat = stats.find((s) => s.participantIndex === participantIdx);
    if (!stat) return "";

    if (position === 0) return "🏆 ¡Campeón!";
    if (position === 1) return "🥈 Segundo lugar";
    if (position === 2) return "🥉 Tercer lugar";

    // Datos divertidos para otros
    const allStats = stats.map((s) => parseFloat(s.avgSpeed));
    const maxSpeed = Math.max(...allStats);
    const minSpeed = Math.min(...allStats);
    const currentSpeed = parseFloat(stat.avgSpeed);

    if (currentSpeed === maxSpeed && position > 2) return "⚡ La más veloz";
    if (currentSpeed === minSpeed) return "🐌 La más tranquila";
    if (position === finishOrder.length - 1) return "🎯 Participará primero";

    return "💪 Buen esfuerzo";
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "40px 20px",
        background: "linear-gradient(135deg, #1a2e1a 0%, #2d5a2d 100%)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "50px",
            color: "#FFD700",
            textShadow: "3px 3px 6px rgba(0,0,0,0.5)",
          }}
        >
          RESULTADOS FINALES
        </h1>

        <div
          style={{
            background: "#fff",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(to right, #FFD700, #FFA500)",
              padding: "25px",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#fff",
                margin: 0,
              }}
            >
              Orden de Llegada
            </h2>
          </div>

          <div style={{ padding: "30px" }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {finishOrder.map((participantIdx, position) => {
                const participant = participants[participantIdx];
                if (!participant) return null;

                return (
                  <div
                    key={position}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "20px",
                      background:
                        position === 0
                          ? "linear-gradient(to right, #FFD700, #FFA500)"
                          : "linear-gradient(to right, #f5f5f5, #e8e8e8)",
                      borderRadius: "10px",
                      borderLeft: `5px solid ${participant.color.hex}`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "32px",
                          fontWeight: "bold",
                          color: position === 0 ? "#fff" : "#333",
                          minWidth: "50px",
                        }}
                      >
                        {position + 1}º
                      </div>
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          backgroundColor: participant.color.hex,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <p
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: position === 0 ? "#fff" : "#333",
                            margin: "0 0 5px 0",
                          }}
                        >
                          {participant.name}
                        </p>
                        {stats.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              gap: "15px",
                              fontSize: "14px",
                              color: position === 0 ? "#fff" : "#666",
                            }}
                          >
                            <span>
                              ⏱️{" "}
                              {
                                stats.find(
                                  (s) => s.participantIndex === participantIdx,
                                )?.finishTime
                              }
                              s
                            </span>
                            <span>
                              🚀{" "}
                              {
                                stats.find(
                                  (s) => s.participantIndex === participantIdx,
                                )?.avgSpeed
                              }{" "}
                              px/s
                            </span>
                            <span>{getFunFact(participantIdx, position)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {position < pointsDistribution.length && (
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "40px", marginBottom: "5px" }}>
                          {position === 0 ? "🏆" : position === 1 ? "🥈" : "🥉"}
                        </div>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: position === 0 ? "#fff" : "#333",
                            margin: 0,
                          }}
                        >
                          {pointsDistribution[position] === 1
                            ? "Gana 1 Punto Slack"
                            : `Gana ${pointsDistribution[position]} Puntos Slack`}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(to right, #45B7D1, #2196F3)",
              padding: "25px",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#fff",
                margin: 0,
              }}
            >
              Orden de Participación
            </h2>
          </div>

          <div style={{ padding: "30px" }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {participationOrder.map((participantIdx, position) => {
                const participant = participants[participantIdx];
                if (!participant) return null;

                return (
                  <div
                    key={position}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "20px",
                      background: "linear-gradient(to right, #f5f5f5, #e8e8e8)",
                      borderRadius: "10px",
                      borderLeft: `5px solid ${participant.color.hex}`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "32px",
                          fontWeight: "bold",
                          color: "#333",
                          minWidth: "50px",
                        }}
                      >
                        {position + 1}º
                      </div>
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          backgroundColor: participant.color.hex,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <p
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#333",
                            margin: "0 0 5px 0",
                          }}
                        >
                          {participant.name}
                        </p>
                        <p
                          style={{ fontSize: "14px", color: "#666", margin: 0 }}
                        >
                          Llegó en posición{" "}
                          {finishOrder.indexOf(participantIdx) + 1}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            display: "flex",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {onReplay && (
            <button
              onClick={onReplay}
              style={{
                padding: "18px 50px",
                background: "linear-gradient(to right, #FFD700, #FFA500)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "22px",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                transition: "all 0.3s ease",
              }}
            >
              🔄 Ver Replay
            </button>
          )}
          <button
            onClick={onReset}
            style={{
              padding: "18px 50px",
              background: "linear-gradient(to right, #45B7D1, #2196F3)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "22px",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
            }}
          >
            Nueva Carrera
          </button>
        </div>
      </div>
    </div>
  );
};
