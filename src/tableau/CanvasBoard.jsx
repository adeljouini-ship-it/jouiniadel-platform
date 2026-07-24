export default function CanvasBoard({
  containerRef,
  canvasFondRef,
  canvasRef,
  outil,
  dessine,
  commencerDessin,
  dessiner,
  terminerDessin,
}) {
  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "calc(100vh - 170px)",
        minHeight: "500px",
        background: "#ffffff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
      }}
    >
      <canvas
        ref={canvasFondRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      <canvas
        ref={canvasRef}
        onPointerDown={commencerDessin}
        onPointerMove={dessiner}
        onPointerUp={terminerDessin}
        onPointerCancel={terminerDessin}
        onContextMenu={(event) => event.preventDefault()}
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          width: "100%",
          height: "100%",
          cursor: outil === "gomme" ? "cell" : "crosshair",
          touchAction: "none",
          userSelect: "none",
        }}
      />

      {dessine && (
        <span
          style={{
            position: "absolute",
            right: "14px",
            bottom: "10px",
            padding: "5px 9px",
            borderRadius: "6px",
            background: "rgba(255,255,255,0.85)",
            fontSize: "13px",
            color: "#6b7280",
            pointerEvents: "none",
          }}
        >
          {outil === "ligne"
            ? "Ligne en cours…"
            : outil === "rectangle"
              ? "Rectangle en cours…"
              : outil === "cercle"
                ? "Cercle en cours…"
                : "Dessin en cours…"}
        </span>
      )}
    </div>
  );
}