import { useEffect, useRef } from "react";

export default function TextEditor({
  visible,
  valeur,
  setValeur,
  position,
  inputRef,
  onValider,
  onAnnuler,
  couleur = "#000000",
  taille = 24,
}) {
  const zoneRef = useRef(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => clearTimeout(timer);
  }, [visible, inputRef]);

  useEffect(() => {
    function gererClicExterieur(event) {
      if (!visible) {
        return;
      }

      if (
        zoneRef.current &&
        !zoneRef.current.contains(event.target)
      ) {
        onValider();
      }
    }

    document.addEventListener(
      "pointerdown",
      gererClicExterieur
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        gererClicExterieur
      );
    };
  }, [visible, onValider]);

  if (!visible) {
    return null;
  }

  return (
    <div
      ref={zoneRef}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
      }}
    >
      <input
        ref={inputRef}
        value={valeur}
        onChange={(event) =>
          setValeur(event.target.value)
        }
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onValider();
          }

          if (event.key === "Escape") {
            event.preventDefault();
            onAnnuler();
          }
        }}
        style={{
          width: `${Math.max(
            40,
            valeur.length * taille * 0.6 + 20
          )}px`,
          minWidth: "40px",
          maxWidth: "600px",
          height: `${taille + 14}px`,
          padding: "4px 6px",
          border: "2px solid #2563eb",
          borderRadius: "5px",
          background: "#ffffff",
         color: couleur,
          fontSize: `${taille}px`,
          fontFamily: "Arial",
          lineHeight: 1.2,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}