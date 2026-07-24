import { useEffect, useRef, useState } from "react";
import Toolbar from "./tableau/Toolbar";
import { dessinerFond } from "./tableau/backgrounds";

export default function TableauBlanc() {
  const canvasRef = useRef(null);
  const canvasFondRef = useRef(null);
  const containerRef = useRef(null);

  const dessineRef = useRef(false);
  const historiqueRef = useRef([]);
  const indexHistoriqueRef = useRef(-1);
  const fondRef = useRef("blanc");

  const pointDepartLigneRef = useRef(null);
  const imageAvantLigneRef = useRef(null);

  const [dessine, setDessine] = useState(false);
  const [couleur, setCouleur] = useState("#000000");
  const [epaisseur, setEpaisseur] = useState(4);
  const [outil, setOutil] = useState("stylo");
  const [fond, setFond] = useState("blanc");

  const [peutAnnuler, setPeutAnnuler] = useState(false);
  const [peutRetablir, setPeutRetablir] = useState(false);

  useEffect(() => {
    redimensionnerCanvas(true);

    function gererRedimensionnement() {
      redimensionnerCanvas(false);
    }

    window.addEventListener("resize", gererRedimensionnement);

    return () => {
      window.removeEventListener("resize", gererRedimensionnement);
    };
  }, []);

  useEffect(() => {
    fondRef.current = fond;
    actualiserFond();
  }, [fond]);

  useEffect(() => {
    function gererRaccourcis(event) {
      const elementActif = document.activeElement;
      const balise = elementActif?.tagName?.toLowerCase();

      if (
        balise === "input" ||
        balise === "textarea" ||
        balise === "select" ||
        elementActif?.isContentEditable
      ) {
        return;
      }

      const controleAppuye = event.ctrlKey || event.metaKey;

      if (controleAppuye && event.key.toLowerCase() === "z") {
        event.preventDefault();

        if (event.shiftKey) {
          retablir();
        } else {
          annuler();
        }
      }

      if (controleAppuye && event.key.toLowerCase() === "y") {
        event.preventDefault();
        retablir();
      }
    }

    window.addEventListener("keydown", gererRaccourcis);

    return () => {
      window.removeEventListener("keydown", gererRaccourcis);
    };
  }, []);

  function actualiserFond() {
    const canvasFond = canvasFondRef.current;

    if (!canvasFond) return;

    const contexteFond = canvasFond.getContext("2d");

    contexteFond.clearRect(
      0,
      0,
      canvasFond.width,
      canvasFond.height
    );

    dessinerFond(
      contexteFond,
      canvasFond.width,
      canvasFond.height,
      fondRef.current
    );
  }

  function mettreAJourBoutonsHistorique() {
    const index = indexHistoriqueRef.current;
    const historique = historiqueRef.current;

    setPeutAnnuler(index > 0);
    setPeutRetablir(index < historique.length - 1);
  }

  function redimensionnerCanvas(initialisation = false) {
    const canvas = canvasRef.current;
    const canvasFond = canvasFondRef.current;
    const container = containerRef.current;

    if (!canvas || !canvasFond || !container) return;

    const ancienneLargeur = canvas.width;
    const ancienneHauteur = canvas.height;

    let ancienneImage = null;

    if (
      !initialisation &&
      ancienneLargeur > 0 &&
      ancienneHauteur > 0
    ) {
      ancienneImage = canvas.toDataURL("image/png");
    }

    const largeur = container.clientWidth;
    const hauteur = Math.max(window.innerHeight - 170, 500);

    canvas.width = largeur;
    canvas.height = hauteur;

    canvasFond.width = largeur;
    canvasFond.height = hauteur;

    actualiserFond();

    const contexte = canvas.getContext("2d");
    contexte.clearRect(0, 0, largeur, hauteur);

    if (initialisation || !ancienneImage) {
      historiqueRef.current = [
        canvas.toDataURL("image/png"),
      ];

      indexHistoriqueRef.current = 0;
      mettreAJourBoutonsHistorique();
      return;
    }

    const image = new Image();

    image.onload = () => {
      contexte.clearRect(0, 0, largeur, hauteur);

      contexte.drawImage(
        image,
        0,
        0,
        ancienneLargeur,
        ancienneHauteur,
        0,
        0,
        largeur,
        hauteur
      );

      const index = indexHistoriqueRef.current;

      if (index >= 0) {
        historiqueRef.current[index] =
          canvas.toDataURL("image/png");
      }
    };

    image.src = ancienneImage;
  }

  function enregistrerEtat() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const nouvelEtat = canvas.toDataURL("image/png");
    const indexActuel = indexHistoriqueRef.current;

    const nouvelHistorique =
      historiqueRef.current.slice(0, indexActuel + 1);

    nouvelHistorique.push(nouvelEtat);

    const limiteHistorique = 50;

    if (nouvelHistorique.length > limiteHistorique) {
      nouvelHistorique.shift();
    }

    historiqueRef.current = nouvelHistorique;
    indexHistoriqueRef.current =
      nouvelHistorique.length - 1;

    mettreAJourBoutonsHistorique();
  }

  function chargerEtat(imageSource) {
    const canvas = canvasRef.current;

    if (!canvas || !imageSource) return;

    const contexte = canvas.getContext("2d");
    const image = new Image();

    image.onload = () => {
      contexte.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      contexte.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    };

    image.src = imageSource;
  }

  function annuler() {
    if (dessineRef.current) return;
    if (indexHistoriqueRef.current <= 0) return;

    indexHistoriqueRef.current -= 1;

    const etat =
      historiqueRef.current[
        indexHistoriqueRef.current
      ];

    chargerEtat(etat);
    mettreAJourBoutonsHistorique();
  }

  function retablir() {
    if (dessineRef.current) return;

    if (
      indexHistoriqueRef.current >=
      historiqueRef.current.length - 1
    ) {
      return;
    }

    indexHistoriqueRef.current += 1;

    const etat =
      historiqueRef.current[
        indexHistoriqueRef.current
      ];

    chargerEtat(etat);
    mettreAJourBoutonsHistorique();
  }

  function obtenirPosition(event) {
    const canvas = canvasRef.current;
    const rectangle = canvas.getBoundingClientRect();

    const echelleX = canvas.width / rectangle.width;
    const echelleY = canvas.height / rectangle.height;

    return {
      x:
        (event.clientX - rectangle.left) *
        echelleX,

      y:
        (event.clientY - rectangle.top) *
        echelleY,
    };
  }

  function tracerApercuLigne(positionFin) {
    const canvas = canvasRef.current;
    const pointDepart = pointDepartLigneRef.current;
    const imageAvantLigne = imageAvantLigneRef.current;

    if (!canvas || !pointDepart || !imageAvantLigne) {
      return;
    }

    const contexte = canvas.getContext("2d");

    contexte.putImageData(imageAvantLigne, 0, 0);

    contexte.save();
    contexte.globalCompositeOperation = "source-over";
    contexte.globalAlpha = 1;
    contexte.strokeStyle = couleur;
    contexte.lineWidth = epaisseur;
    contexte.lineCap = "round";
    contexte.lineJoin = "round";

    contexte.beginPath();
    contexte.moveTo(pointDepart.x, pointDepart.y);
    contexte.lineTo(positionFin.x, positionFin.y);
    contexte.stroke();
    contexte.closePath();

    contexte.restore();
  }

  function commencerDessin(event) {
    event.preventDefault();

    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const contexte = canvas.getContext("2d");
    const position = obtenirPosition(event);

    try {
      canvas.setPointerCapture(event.pointerId);
    } catch {
      // Le pointeur est peut-être déjà capturé.
    }

    if (outil === "ligne") {
      pointDepartLigneRef.current = position;

      imageAvantLigneRef.current = contexte.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      dessineRef.current = true;
      setDessine(true);
      return;
    }

    contexte.beginPath();
    contexte.moveTo(position.x, position.y);

    dessineRef.current = true;
    setDessine(true);
  }

  function dessiner(event) {
    if (!dessineRef.current) return;

    event.preventDefault();

    const canvas = canvasRef.current;
    const contexte = canvas.getContext("2d");
    const position = obtenirPosition(event);

    if (outil === "ligne") {
      tracerApercuLigne(position);
      return;
    }

    const pression =
      event.pointerType === "pen" &&
      event.pressure > 0
        ? event.pressure
        : 0.5;

    contexte.save();

    contexte.lineCap = "round";
    contexte.lineJoin = "round";
    contexte.globalAlpha = 1;

    if (outil === "gomme") {
      contexte.globalCompositeOperation =
        "destination-out";

      contexte.strokeStyle = "#000000";
      contexte.lineWidth = epaisseur * 5;
    } else {
      contexte.globalCompositeOperation =
        "source-over";

      contexte.strokeStyle = couleur;

      contexte.lineWidth = Math.max(
        1,
        epaisseur * pression * 2
      );
    }

    contexte.lineTo(position.x, position.y);
    contexte.stroke();
    contexte.restore();

    contexte.beginPath();
    contexte.moveTo(position.x, position.y);
  }

  function terminerDessin(event) {
    if (!dessineRef.current) return;

    const canvas = canvasRef.current;
    const contexte = canvas.getContext("2d");

    if (outil === "ligne") {
      if (event?.type === "pointercancel") {
        if (imageAvantLigneRef.current) {
          contexte.putImageData(
            imageAvantLigneRef.current,
            0,
            0
          );
        }
      } else if (event) {
        tracerApercuLigne(obtenirPosition(event));
      }

      pointDepartLigneRef.current = null;
      imageAvantLigneRef.current = null;
    } else {
      contexte.closePath();
    }

    if (event?.pointerId !== undefined) {
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // Le pointeur est peut-être déjà libéré.
      }
    }

    dessineRef.current = false;
    setDessine(false);

    if (event?.type !== "pointercancel") {
      enregistrerEtat();
    }
  }

  function effacerTout() {
    const confirmation = window.confirm(
      "Voulez-vous vraiment effacer tout le tableau ?"
    );

    if (!confirmation) return;

    const canvas = canvasRef.current;
    const contexte = canvas.getContext("2d");

    contexte.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    enregistrerEtat();
  }

  function telechargerImage() {
    const canvas = canvasRef.current;
    const canvasFond = canvasFondRef.current;

    if (!canvas || !canvasFond) return;

    const canvasFinal =
      document.createElement("canvas");

    canvasFinal.width = canvas.width;
    canvasFinal.height = canvas.height;

    const contexteFinal =
      canvasFinal.getContext("2d");

    contexteFinal.drawImage(canvasFond, 0, 0);
    contexteFinal.drawImage(canvas, 0, 0);

    const lien = document.createElement("a");

    lien.download = `tableau-${Date.now()}.png`;
    lien.href = canvasFinal.toDataURL("image/png");
    lien.click();
  }

  function retournerAccueil() {
    window.location.href = window.location.pathname;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <Toolbar
        outil={outil}
        setOutil={setOutil}
        couleur={couleur}
        setCouleur={setCouleur}
        epaisseur={epaisseur}
        setEpaisseur={setEpaisseur}
        fond={fond}
        setFond={setFond}
        peutAnnuler={peutAnnuler}
        peutRetablir={peutRetablir}
        annuler={annuler}
        retablir={retablir}
        effacerTout={effacerTout}
        telechargerImage={telechargerImage}
        retournerAccueil={retournerAccueil}
      />

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
          boxShadow:
            "0 2px 12px rgba(0,0,0,0.1)",
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
          onContextMenu={(event) =>
            event.preventDefault()
          }
          style={{
            position: "absolute",
            inset: 0,
            display: "block",
            width: "100%",
            height: "100%",
            cursor:
              outil === "gomme"
                ? "cell"
                : "crosshair",
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
              background:
                "rgba(255,255,255,0.85)",
              fontSize: "13px",
              color: "#6b7280",
              pointerEvents: "none",
            }}
          >
            {outil === "ligne"
              ? "Ligne en cours…"
              : "Dessin en cours…"}
          </span>
        )}
      </div>
    </div>
  );
}