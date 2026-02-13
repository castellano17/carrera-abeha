export const BeeSVG = ({ color, size = 50 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
    >
      {/* Cuerpo amarillo con rayas negras */}
      <ellipse cx="30" cy="32" rx="12" ry="18" fill="#FFD700" />

      {/* Rayas negras del cuerpo */}
      <rect x="20" y="18" width="20" height="3" fill="#000" />
      <rect x="20" y="28" width="20" height="3" fill="#000" />
      <rect x="20" y="38" width="20" height="3" fill="#000" />

      {/* Cabeza negra */}
      <circle cx="30" cy="12" r="8" fill="#000" />

      {/* Ojos blancos */}
      <circle cx="26" cy="10" r="2.5" fill="#fff" />
      <circle cx="34" cy="10" r="2.5" fill="#fff" />

      {/* Antenas */}
      <line
        x1="28"
        y1="5"
        x2="24"
        y2="0"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="32"
        y1="5"
        x2="36"
        y2="0"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Alas del color del participante - GRANDES Y VISIBLES */}
      <ellipse cx="14" cy="28" rx="8" ry="14" fill={color} opacity="0.85" />
      <ellipse cx="46" cy="28" rx="8" ry="14" fill={color} opacity="0.85" />

      {/* Patas */}
      <line
        x1="22"
        y1="48"
        x2="18"
        y2="56"
        stroke="#000"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="30"
        y1="50"
        x2="30"
        y2="58"
        stroke="#000"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="38"
        y1="48"
        x2="42"
        y2="56"
        stroke="#000"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
