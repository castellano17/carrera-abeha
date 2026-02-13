import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { BeeSVG } from "./BeeSVG";
import { ResultsPodium } from "./ResultsPodium";

export const RaceTrack = ({ participants, pointsDistribution, onReset }) => {
  const [positions, setPositions] = useState(participants.map(() => 0));
  const [isRacing, setIsRacing] = useState(false);
  const [raceComplete, setRaceComplete] = useState(false);
  const [results, setResults] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [hoveredColor, setHoveredColor] = useState(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const [recordedRace, setRecordedRace] = useState([]);
  const raceStartTimeRef = useRef(null);
  const raceStatsRef = useRef([]);

  const TRACK_WIDTH = 1400;
  const FINISH_LINE = TRACK_WIDTH - 120;

  const finishedRef = useRef([]);
  const speedsRef = useRef([]);
  const audioContextRef = useRef(null);
  const buzzSoundRef = useRef(null);
  const crowdSoundRef = useRef(null);

  useEffect(() => {
    speedsRef.current = participants.map(() => Math.random() * 3 + 2.5);
  }, [participants.length]);

  useEffect(() => {
    if (isRacing && !audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || window.webkitAudioContext
      )();

      // Zumbido de abejas
      const buzzOscillator = audioContextRef.current.createOscillator();
      const buzzModulator = audioContextRef.current.createOscillator();
      const modulatorGain = audioContextRef.current.createGain();
      const buzzGain = audioContextRef.current.createGain();

      buzzModulator.frequency.value = 5;
      modulatorGain.gain.value = 30;
      buzzModulator.connect(modulatorGain);
      modulatorGain.connect(buzzOscillator.frequency);

      buzzOscillator.frequency.value = 250;
      buzzOscillator.type = "sine";
      buzzOscillator.connect(buzzGain);
      buzzGain.connect(audioContextRef.current.destination);
      buzzGain.gain.value = 0.04;

      buzzOscillator.start();
      buzzModulator.start();
      buzzSoundRef.current = {
        oscillator: buzzOscillator,
        modulator: buzzModulator,
        gain: buzzGain,
      };

      // Multitud animando (ruido blanco filtrado)
      const bufferSize = 2 * audioContextRef.current.sampleRate;
      const noiseBuffer = audioContextRef.current.createBuffer(
        1,
        bufferSize,
        audioContextRef.current.sampleRate,
      );
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = audioContextRef.current.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const crowdFilter = audioContextRef.current.createBiquadFilter();
      crowdFilter.type = "bandpass";
      crowdFilter.frequency.value = 800;
      crowdFilter.Q.value = 2;

      const crowdGain = audioContextRef.current.createGain();
      crowdGain.gain.value = 0.08;

      whiteNoise.connect(crowdFilter);
      crowdFilter.connect(crowdGain);
      crowdGain.connect(audioContextRef.current.destination);
      whiteNoise.start();

      crowdSoundRef.current = { source: whiteNoise, gain: crowdGain };
    }

    if (!isRacing && audioContextRef.current) {
      if (buzzSoundRef.current) {
        buzzSoundRef.current.oscillator.stop();
        buzzSoundRef.current.modulator.stop();
        buzzSoundRef.current = null;
      }
      if (crowdSoundRef.current) {
        crowdSoundRef.current.source.stop();
        crowdSoundRef.current = null;
      }
      audioContextRef.current = null;
    }

    return () => {
      if (buzzSoundRef.current) {
        try {
          buzzSoundRef.current.oscillator.stop();
          buzzSoundRef.current.modulator.stop();
        } catch (e) {}
      }
      if (crowdSoundRef.current) {
        try {
          crowdSoundRef.current.source.stop();
        } catch (e) {}
      }
    };
  }, [isRacing]);

  // Cuenta regresiva
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        const audioContext = new (
          window.AudioContext || window.webkitAudioContext
        )();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = countdown === 1 ? 800 : 600;
        gainNode.gain.value = 0.2;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Mostrar "ABEHA!" por 0.6 segundos antes de empezar
      const timer = setTimeout(() => {
        setCountdown(null);
        setIsRacing(true);
        raceStartTimeRef.current = Date.now(); // Iniciar cronómetro
      }, 600);

      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 1000;
      gainNode.gain.value = 0.3;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (!isRacing || isReplaying) return;

    const interval = setInterval(() => {
      setPositions((prevPositions) => {
        const newPositions = [...prevPositions];

        for (let i = 0; i < participants.length; i++) {
          if (finishedRef.current.includes(i)) continue;

          if (Math.random() < 0.2) {
            speedsRef.current[i] = Math.random() * 3 + 2.5;
          }

          newPositions[i] += speedsRef.current[i];

          if (newPositions[i] >= FINISH_LINE) {
            newPositions[i] = FINISH_LINE;

            // Calcular estadísticas al terminar
            const finishTime = (Date.now() - raceStartTimeRef.current) / 1000;
            const avgSpeed = (FINISH_LINE / finishTime).toFixed(1);

            finishedRef.current.push(i);

            // Guardar estadísticas
            raceStatsRef.current.push({
              participantIndex: i,
              finishTime: finishTime.toFixed(2),
              avgSpeed: avgSpeed,
              position: finishedRef.current.length,
            });

            if (finishedRef.current.length === 1) {
              confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.5 },
              });

              // Sonido de victoria
              const audioContext = new (
                window.AudioContext || window.webkitAudioContext
              )();
              const playVictorySound = () => {
                const notes = [523.25, 659.25, 783.99, 1046.5];
                notes.forEach((freq, i) => {
                  const oscillator = audioContext.createOscillator();
                  const gainNode = audioContext.createGain();

                  oscillator.connect(gainNode);
                  gainNode.connect(audioContext.destination);

                  oscillator.frequency.value = freq;
                  oscillator.type = "sine";

                  gainNode.gain.setValueAtTime(
                    0.15,
                    audioContext.currentTime + i * 0.15,
                  );
                  gainNode.gain.exponentialRampToValueAtTime(
                    0.01,
                    audioContext.currentTime + i * 0.15 + 0.3,
                  );

                  oscillator.start(audioContext.currentTime + i * 0.15);
                  oscillator.stop(audioContext.currentTime + i * 0.15 + 0.3);
                });
              };
              playVictorySound();
            }

            if (finishedRef.current.length === participants.length) {
              setResults({
                finishOrder: [...finishedRef.current],
                participants: participants,
                stats: [...raceStatsRef.current],
              });
              setRaceComplete(true);
              setIsRacing(false);
            }
          }
        }

        // Grabar posiciones para replay
        setRecordedRace((prev) => [...prev, [...newPositions]]);

        return newPositions;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isRacing, isReplaying, participants.length]);

  // Calcular posiciones actuales
  const getCurrentRankings = () => {
    return positions
      .map((pos, index) => ({ index, position: pos }))
      .sort((a, b) => b.position - a.position)
      .map((item, rank) => ({ ...item, rank: rank + 1 }));
  };

  const rankings = getCurrentRankings();

  const handleReset = () => {
    finishedRef.current = [];
    speedsRef.current = participants.map(() => Math.random() * 3 + 2.5);
    setPositions(participants.map(() => 0));
    setRaceComplete(false);
    setResults(null);
    setRecordedRace([]);
    setIsReplaying(false);
    raceStatsRef.current = [];
    raceStartTimeRef.current = null;
    onReset();
  };

  const handleReplay = () => {
    if (recordedRace.length === 0) return;

    setIsReplaying(true);
    setRaceComplete(false);
    setResults(null);
    setPositions(participants.map(() => 0));

    let frameIndex = 0;
    const replayInterval = setInterval(() => {
      if (frameIndex >= recordedRace.length) {
        clearInterval(replayInterval);
        setIsReplaying(false);
        setRaceComplete(true);
        setResults({
          finishOrder: [...finishedRef.current],
          participants: participants,
          stats: [...raceStatsRef.current],
        });
        return;
      }

      setPositions(recordedRace[frameIndex]);
      frameIndex++;
    }, 30);
  };

  if (raceComplete && results) {
    return (
      <ResultsPodium
        participants={results.participants}
        finishOrder={results.finishOrder}
        stats={results.stats}
        pointsDistribution={pointsDistribution}
        onReset={handleReset}
        onReplay={recordedRace.length > 0 ? handleReplay : null}
      />
    );
  }

  const trackHeight = Math.max(500, participants.length * 60 + 40);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "30px 20px",
        background: "linear-gradient(135deg, #1a2e1a 0%, #2d5a2d 100%)",
      }}
    >
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "50px",
            color: "#FFD700",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          La carrera de ABEHA
        </h1>

        <div
          style={{
            background: "linear-gradient(135deg, #2d5a2d 0%, #1a3a1a 100%)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
            marginBottom: "40px",
            border: "3px solid #FFD700",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "12px",
              marginBottom: "30px",
            }}
          >
            {participants.map((p, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredColor(i)}
                onMouseLeave={() => setHoveredColor(null)}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  border: "2px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                }}
              >
                {hoveredColor === i && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-40px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "rgba(0,0,0,0.9)",
                      color: "#FFD700",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      zIndex: 1000,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                    }}
                  >
                    {p.color.name}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-6px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: 0,
                        borderLeft: "6px solid transparent",
                        borderRight: "6px solid transparent",
                        borderTop: "6px solid rgba(0,0,0,0.9)",
                      }}
                    />
                  </div>
                )}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: p.color.hex,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                />
                <span
                  style={{
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {p.name}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
                justifyContent: "flex-start",
                paddingTop: "20px",
              }}
            >
              {participants.map((p, i) => (
                <div
                  key={i}
                  style={{
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: "15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#FFD700",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                    minWidth: "100px",
                  }}
                >
                  {p.name}
                </div>
              ))}
            </div>

            <div
              style={{
                position: "relative",
                flex: 1,
                height: `${trackHeight}px`,
                background:
                  "linear-gradient(to bottom, #0d1f0d 0%, #1a3a1a 100%)",
                borderRadius: "15px",
                border: "4px solid #4a7c4a",
                overflow: "hidden",
                boxShadow: "inset 0 4px 12px rgba(0,0,0,0.6)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 100px)",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  right: 0,
                  width: "140px",
                  zIndex: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(to left, rgba(0,0,0,0.2), transparent)",
                  borderLeft: "4px solid #FFD700",
                }}
              >
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 100 100"
                  style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.8))" }}
                >
                  <defs>
                    <pattern
                      id="checkerboard"
                      x="0"
                      y="0"
                      width="10"
                      height="10"
                      patternUnits="userSpaceOnUse"
                    >
                      <rect x="0" y="0" width="5" height="5" fill="#000" />
                      <rect x="5" y="5" width="5" height="5" fill="#000" />
                      <rect x="5" y="0" width="5" height="5" fill="#fff" />
                      <rect x="0" y="5" width="5" height="5" fill="#fff" />
                    </pattern>
                  </defs>
                  <rect
                    x="20"
                    y="15"
                    width="50"
                    height="40"
                    fill="url(#checkerboard)"
                    stroke="#000"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="18"
                    y="55"
                    width="4"
                    height="30"
                    fill="#333"
                    rx="2"
                  />
                </svg>
              </div>

              {participants.map((participant, index) => (
                <motion.div
                  key={index}
                  animate={{
                    x: positions[index],
                    y: isRacing || isReplaying ? [0, -3, 0, -3, 0] : 0,
                  }}
                  transition={{
                    x: { type: "linear", duration: 0 },
                    y: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
                  }}
                  style={{
                    position: "absolute",
                    top: `${20 + index * 60}px`,
                    left: 0,
                    zIndex: 20 + index,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {/* Estela sutil - chispitas brillantes */}
                  {(isRacing || isReplaying) && positions[index] > 0 && (
                    <>
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: [0.8, 0],
                            scale: [0.5, 0.2],
                            x: [-10 - i * 6, -18 - i * 8],
                            y: [Math.sin(i) * 3, Math.sin(i + 1) * 5],
                          }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: i * 0.08,
                            ease: "easeOut",
                          }}
                          style={{
                            position: "absolute",
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            backgroundColor: "#FFD700",
                            boxShadow: `0 0 4px ${participant.color.hex}`,
                            pointerEvents: "none",
                          }}
                        />
                      ))}
                    </>
                  )}

                  <BeeSVG color={participant.color.hex} size={50} />
                  {(isRacing || isReplaying) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        backgroundColor:
                          rankings.find((r) => r.index === index)?.rank === 1
                            ? "#FFD700"
                            : rankings.find((r) => r.index === index)?.rank ===
                                2
                              ? "#C0C0C0"
                              : rankings.find((r) => r.index === index)
                                    ?.rank === 3
                                ? "#CD7F32"
                                : "rgba(255,255,255,0.9)",
                        color:
                          rankings.find((r) => r.index === index)?.rank <= 3
                            ? "#000"
                            : "#333",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                        minWidth: "35px",
                        textAlign: "center",
                      }}
                    >
                      {rankings.find((r) => r.index === index)?.rank}°
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {countdown !== null && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 200,
                    fontSize: countdown === 0 ? "80px" : "120px",
                    fontWeight: "bold",
                    color: "#FFD700",
                    textShadow:
                      "0 0 30px rgba(255,215,0,0.8), 0 0 60px rgba(255,215,0,0.5), 4px 4px 8px rgba(0,0,0,0.9)",
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {countdown === 0 ? "ABEHA!" : countdown}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (isRacing) {
                setIsRacing(false);
              } else if (countdown === null) {
                setCountdown(3);
              }
            }}
            disabled={raceComplete || countdown !== null}
            style={{
              padding: "20px 50px",
              background: isRacing
                ? "linear-gradient(to right, #FF6B6B, #FF4444)"
                : "linear-gradient(to right, #FFD700, #FFA500)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "24px",
              border: "none",
              borderRadius: "12px",
              cursor:
                raceComplete || countdown !== null ? "not-allowed" : "pointer",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
              opacity: raceComplete || countdown !== null ? 0.5 : 1,
              transition: "all 0.3s ease",
            }}
          >
            {isRacing ? "Pausar" : "Comenzar Carrera 🐝"}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
