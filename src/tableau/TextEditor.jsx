import { useEffect } from "react";

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
  gras = false,
  italique = false,
}) {
  useEffect(() => {
    if (!visible) {
      return;
    }

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => clearTimeout(timer);
  }, [visible, inputRef]);

  if (!visible) {
    return null;
  }

  return (
    <input
      ref={inputRef}
      value={valeur}
      onChange={(event) => {
        setValeur(event.target.value);
      }}
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
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,

        width: `${Math.max(
          60,
          valeur.length * taille * 0.6 + 20
        )}px`,
        minWidth: "60px",
        maxWidth: "600px",
        height: `${taille + 14}px`,

        padding: "4px 6px",
        border: "2px solid #2563eb",
        borderRadius: "5px",
        background: "#ffffff",
        color: couleur,

        fontSize: `${taille}px`,
        fontFamily: "Arial",
        fontWeight: gras ? "bold" : "normal",
        fontStyle: italique ? "italic" : "normal",
        lineHeight: 1.2,

        outline: "none",
        boxSizing: "border-box",
      }}
    />
  );
}