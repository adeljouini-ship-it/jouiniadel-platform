import TextEditor from "./TextEditor";

export default function CanvasBoard({
  containerRef,
  canvasFondRef,
  canvasRef,
  outil,
  dessine,
  commencerDessin,
  dessiner,
  terminerDessin,

  texteEdition,
  texte,
  setTexte,
  positionTexte,
  inputTexteRef,
  validerTexte,
  annulerTexte,

  couleur,
  epaisseur,
}) {
  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "calc(100vh - 170px)",
        minHeight: "500px",
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,.1)",
      }}
    >
      <canvas
        ref={canvasFondRef}
        style={{
          position: "absolute",
          inset: 0,
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
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          touchAction: "none",
          cursor: outil === "gomme" ? "cell" : "crosshair",
        }}
      />

      <TextEditor
        visible={texteEdition}
        valeur={texte}
        setValeur={setTexte}
        position={positionTexte}
        inputRef={inputTexteRef}
        onValider={validerTexte}
        onAnnuler={annulerTexte}
        couleur={couleur}
        taille={Math.max(18, epaisseur * 5)}
      />

      {dessine && (
        <span
          style={{
            position: "absolute",
            right: 15,
            bottom: 10,
            background: "rgba(255,255,255,.9)",
            padding: "5px 10px",
            borderRadius: 6,
            fontSize: 13,
          }}
        >
          Dessin...
        </span>
      )}
    </div>
  );
}