import { useEffect } from "react";

export default function TextEditor({
  visible,
  valeur,
  setValeur,
  position,
  inputRef,
  onValider,
  onAnnuler,
}) {
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [visible, inputRef]);

  if (!visible) {
    return null;
  }

  return (
    <input
      ref={inputRef}
      value={valeur}
      onChange={(e) =>
        setValeur(e.target.value)
      }
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onValider();
        }

        if (e.key === "Escape") {
          onAnnuler();
        }
      }}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        fontSize: "28px",
        fontFamily: "Arial",
        border: "2px solid #2563eb",
        borderRadius: "6px",
        padding: "4px 8px",
        background: "#ffffff",
        outline: "none",
        zIndex: 9999,
        minWidth: "120px",
      }}
    />
  );
}