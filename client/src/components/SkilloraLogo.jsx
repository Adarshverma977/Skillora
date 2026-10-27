
import skilloraIcon from "../assets/images/skillora-icon.png";
import "./SkilloraLogo.css";

function SkilloraLogo({
  variant = "full",
  showTagline = false,
  className = "",
}) {
  return (
    <span
      className={`skillora-logo skillora-logo--${variant} ${className}`.trim()}
      role="img"
      aria-label="Skillora — Your Learning Space"
    >
      <img
        src={skilloraIcon}
        alt=""
        className="skillora-logo__symbol"
        draggable="false"
      />

      {variant !== "icon" && (
        <span className="skillora-logo__copy">
          <span className="skillora-logo__word">
            <span className="skillora-logo__skill">Skill</span>
            <span className="skillora-logo__ora">ora</span>
          </span>

          {showTagline && (
            <span className="skillora-logo__tagline">
              YOUR LEARNING SPACE
            </span>
          )}
        </span>
      )}
    </span>
  );
}

export default SkilloraLogo;
