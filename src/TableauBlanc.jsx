import { useEffect, useRef, useState } from "react";
import Toolbar from "./tableau/Toolbar";
import CanvasBoard from "./tableau/CanvasBoard";
import dessinerFleche from "./tableau/tools/ArrowTool";

function dessinerQuadrillage(
  contexte,
  largeur,
  hauteur,
  pas,
  couleur,
  epaisseur
) {
  contexte.save();
  contexte.beginPath();
  contexte.strokeStyle = couleur;
  contexte.lineWidth = epaisseur;

  for (let x = 0; x <= largeur; x += pas) {
    contexte.moveTo(x, 0);
    contexte.lineTo(x, hauteur);
  }

  for (let y = 0; y <= hauteur; y += pas) {
    contexte.moveTo(0, y);
    contexte.lineTo(largeur, y);
  }

  contexte.stroke();
  contexte.restore();
}

function dessinerRepere(contexte, largeur, hauteur) {
  const centreX = largeur / 2;
  const centreY = hauteur / 2;
  const pas = 40;

  dessinerQuadrillage(
    contexte,
    largeur,
    hauteur,
    pas,
    "#e5e7eb",
    1
  );

  contexte.save();
  contexte.strokeStyle = "#64748b";
  contexte.fillStyle = "#64748b";
  contexte.lineWidth = 2;

  contexte.beginPath();
  contexte.moveTo(0, centreY);
  contexte.lineTo(largeur, centreY);
  contexte.moveTo(centreX, 0);
  contexte.lineTo(centreX, hauteur);
  contexte.stroke();

  contexte.beginPath();
  contexte.moveTo(largeur - 10, centreY - 5);
  contexte.lineTo(largeur, centreY);
  contexte.lineTo(largeur - 10, centreY + 5);
  contexte.fill();

  contexte.beginPath();
  contexte.moveTo(centreX - 5, 10);
  contexte.lineTo(centreX, 0);
  contexte.lineTo(centreX + 5, 10);
  contexte.fill();

  contexte.restore();
}

function dessinerFond(
  contexte,
  largeur,
  hauteur,
  fond
) {
  contexte.save();

  contexte.fillStyle = "#ffffff";
  contexte.fillRect(0, 0, largeur, hauteur);

  if (fond === "blanc") {
    contexte.restore();
    return;
  }

  if (fond === "petits") {
    dessinerQuadrillage(
      contexte,
      largeur,
      hauteur,
      20,
      "#e5e7eb",
      1
    );
  }

  if (fond === "grands") {
    dessinerQuadrillage(
      contexte,
      largeur,
      hauteur,
      40,
      "#d1d5db",
      1
    );
  }

  if (fond === "millimetre") {
    dessinerQuadrillage(
      contexte,
      largeur,
      hauteur,
      10,
      "#eef2f7",
      1
    );

    dessinerQuadrillage(
      contexte,
      largeur,
      hauteur,
      50,
      "#cbd5e1",
      1
    );
  }

  if (fond === "repere") {
    dessinerRepere(
      contexte,
      largeur,
      hauteur
    );
  }

  contexte.restore();
}

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

  const pointDepartFlecheRef = useRef(null);
  const imageAvantFlecheRef = useRef(null);

  const pointDepartRectangleRef = useRef(null);
  const imageAvantRectangleRef = useRef(null);

  const centreCercleRef = useRef(null);
  const imageAvantCercleRef = useRef(null);

  const inputTexteRef = useRef(null);
  const positionTexteCanvasRef = useRef({ x: 0, y: 0 });

  const [dessine, setDessine] = useState(false);
  const [couleur, setCouleur] =
    useState("#000000");
  const [epaisseur, setEpaisseur] =
    useState(4);
const [tailleTexte, setTailleTexte] = useState(24);
  const [texteGras, setTexteGras] =
    useState(false);

  const [texteItalique, setTexteItalique] =
    useState(false);

  const [outil, setOutil] =
    useState("stylo");
  const [fond, setFond] =
    useState("blanc");

  const [texteEdition, setTexteEdition] =
    useState(false);
  const [texte, setTexte] = useState("");
  const [positionTexte, setPositionTexte] =
    useState({ x: 0, y: 0 });

  const [peutAnnuler, setPeutAnnuler] =
    useState(false);

  const [peutRetablir, setPeutRetablir] =
    useState(false);

  useEffect(() => {
    redimensionnerCanvas(true);

    function gererRedimensionnement() {
      redimensionnerCanvas(false);
    }

    window.addEventListener(
      "resize",
      gererRedimensionnement
    );

    return () => {
      window.removeEventListener(
        "resize",
        gererRedimensionnement
      );
    };
  }, []);

  useEffect(() => {
    fondRef.current = fond;
    actualiserFond();
  }, [fond]);

  useEffect(() => {
    function gererRaccourcis(event) {
      const elementActif =
        document.activeElement;

      const balise =
        elementActif?.tagName?.toLowerCase();

      if (
        balise === "input" ||
        balise === "textarea" ||
        balise === "select" ||
        elementActif?.isContentEditable
      ) {
        return;
      }

      const controleAppuye =
        event.ctrlKey || event.metaKey;

      if (
        controleAppuye &&
        event.key.toLowerCase() === "z"
      ) {
        event.preventDefault();

        if (event.shiftKey) {
          retablir();
        } else {
          annuler();
        }
      }

      if (
        controleAppuye &&
        event.key.toLowerCase() === "y"
      ) {
        event.preventDefault();
        retablir();
      }
    }

    window.addEventListener(
      "keydown",
      gererRaccourcis
    );

    return () => {
      window.removeEventListener(
        "keydown",
        gererRaccourcis
      );
    };
  }, []);

  function actualiserFond() {
    const canvasFond =
      canvasFondRef.current;

    if (!canvasFond) {
      return;
    }

    const contexteFond =
      canvasFond.getContext("2d");

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
    const index =
      indexHistoriqueRef.current;

    const historique =
      historiqueRef.current;

    setPeutAnnuler(index > 0);

    setPeutRetablir(
      index < historique.length - 1
    );
  }

  function redimensionnerCanvas(
    initialisation = false
  ) {
    const canvas = canvasRef.current;
    const canvasFond =
      canvasFondRef.current;
    const container =
      containerRef.current;

    if (
      !canvas ||
      !canvasFond ||
      !container
    ) {
      return;
    }

    const ancienneLargeur =
      canvas.width;

    const ancienneHauteur =
      canvas.height;

    let ancienneImage = null;

    if (
      !initialisation &&
      ancienneLargeur > 0 &&
      ancienneHauteur > 0
    ) {
      ancienneImage =
        canvas.toDataURL("image/png");
    }

    const largeur =
      container.clientWidth;

    const hauteur = Math.max(
      window.innerHeight - 170,
      500
    );

    canvas.width = largeur;
    canvas.height = hauteur;

    canvasFond.width = largeur;
    canvasFond.height = hauteur;

    actualiserFond();

    const contexte =
      canvas.getContext("2d");

    contexte.clearRect(
      0,
      0,
      largeur,
      hauteur
    );

    if (
      initialisation ||
      !ancienneImage
    ) {
      historiqueRef.current = [
        canvas.toDataURL("image/png"),
      ];

      indexHistoriqueRef.current = 0;

      mettreAJourBoutonsHistorique();
      return;
    }

    const image = new Image();

    image.onload = () => {
      contexte.clearRect(
        0,
        0,
        largeur,
        hauteur
      );

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

      const index =
        indexHistoriqueRef.current;

      if (index >= 0) {
        historiqueRef.current[index] =
          canvas.toDataURL("image/png");
      }
    };

    image.src = ancienneImage;
  }

  function enregistrerEtat() {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const nouvelEtat =
      canvas.toDataURL("image/png");

    const indexActuel =
      indexHistoriqueRef.current;

    const nouvelHistorique =
      historiqueRef.current.slice(
        0,
        indexActuel + 1
      );

    nouvelHistorique.push(nouvelEtat);

    const limiteHistorique = 50;

    if (
      nouvelHistorique.length >
      limiteHistorique
    ) {
      nouvelHistorique.shift();
    }

    historiqueRef.current =
      nouvelHistorique;

    indexHistoriqueRef.current =
      nouvelHistorique.length - 1;

    mettreAJourBoutonsHistorique();
  }

  function chargerEtat(imageSource) {
    const canvas = canvasRef.current;

    if (!canvas || !imageSource) {
      return;
    }

    const contexte =
      canvas.getContext("2d");

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
    if (dessineRef.current) {
      return;
    }

    if (
      indexHistoriqueRef.current <= 0
    ) {
      return;
    }

    indexHistoriqueRef.current -= 1;

    const etat =
      historiqueRef.current[
        indexHistoriqueRef.current
      ];

    chargerEtat(etat);
    mettreAJourBoutonsHistorique();
  }

  function retablir() {
    if (dessineRef.current) {
      return;
    }

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

    if (!canvas) {
      return {
        x: 0,
        y: 0,
      };
    }

    const rectangle =
      canvas.getBoundingClientRect();

    const echelleX =
      canvas.width / rectangle.width;

    const echelleY =
      canvas.height / rectangle.height;

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

    const pointDepart =
      pointDepartLigneRef.current;

    const imageAvantLigne =
      imageAvantLigneRef.current;

    if (
      !canvas ||
      !pointDepart ||
      !imageAvantLigne
    ) {
      return;
    }

    const contexte =
      canvas.getContext("2d");

    contexte.putImageData(
      imageAvantLigne,
      0,
      0
    );

    contexte.save();

    contexte.globalCompositeOperation =
      "source-over";

    contexte.globalAlpha = 1;
    contexte.strokeStyle = couleur;
    contexte.lineWidth = epaisseur;
    contexte.lineCap = "round";
    contexte.lineJoin = "round";

    contexte.beginPath();

    contexte.moveTo(
      pointDepart.x,
      pointDepart.y
    );

    contexte.lineTo(
      positionFin.x,
      positionFin.y
    );

    contexte.stroke();
    contexte.closePath();
    contexte.restore();
  }

  function tracerApercuFleche(positionFin) {
    const canvas = canvasRef.current;

    const pointDepart =
      pointDepartFlecheRef.current;

    const imageAvantFleche =
      imageAvantFlecheRef.current;

    if (
      !canvas ||
      !pointDepart ||
      !imageAvantFleche
    ) {
      return;
    }

    const contexte =
      canvas.getContext("2d");

    contexte.putImageData(
      imageAvantFleche,
      0,
      0
    );

    dessinerFleche(
      contexte,
      pointDepart,
      positionFin,
      couleur,
      epaisseur
    );
  }

  function tracerApercuRectangle(
    positionFin,
    carreForce = false
  ) {
    const canvas = canvasRef.current;

    const pointDepart =
      pointDepartRectangleRef.current;

    const imageAvantRectangle =
      imageAvantRectangleRef.current;

    if (
      !canvas ||
      !pointDepart ||
      !imageAvantRectangle
    ) {
      return;
    }

    const contexte =
      canvas.getContext("2d");

    contexte.putImageData(
      imageAvantRectangle,
      0,
      0
    );

    let largeur =
      positionFin.x - pointDepart.x;

    let hauteur =
      positionFin.y - pointDepart.y;

    if (carreForce) {
      const taille = Math.max(
        Math.abs(largeur),
        Math.abs(hauteur)
      );

      largeur =
        largeur < 0
          ? -taille
          : taille;

      hauteur =
        hauteur < 0
          ? -taille
          : taille;
    }

    contexte.save();

    contexte.globalCompositeOperation =
      "source-over";

    contexte.globalAlpha = 1;
    contexte.strokeStyle = couleur;
    contexte.lineWidth = epaisseur;
    contexte.lineCap = "round";
    contexte.lineJoin = "round";

    contexte.beginPath();

    contexte.rect(
      pointDepart.x,
      pointDepart.y,
      largeur,
      hauteur
    );

    contexte.stroke();
    contexte.closePath();
    contexte.restore();
  }

  function tracerApercuCercle(positionFin) {
    const canvas = canvasRef.current;

    const centre =
      centreCercleRef.current;

    const imageAvantCercle =
      imageAvantCercleRef.current;

    if (
      !canvas ||
      !centre ||
      !imageAvantCercle
    ) {
      return;
    }

    const contexte =
      canvas.getContext("2d");

    const rayon = Math.hypot(
      positionFin.x - centre.x,
      positionFin.y - centre.y
    );

    contexte.putImageData(
      imageAvantCercle,
      0,
      0
    );

    contexte.save();

    contexte.globalCompositeOperation =
      "source-over";

    contexte.globalAlpha = 1;
    contexte.strokeStyle = couleur;
    contexte.lineWidth = epaisseur;
    contexte.lineCap = "round";
    contexte.lineJoin = "round";

    contexte.beginPath();

    contexte.arc(
      centre.x,
      centre.y,
      rayon,
      0,
      Math.PI * 2
    );

    contexte.stroke();
    contexte.closePath();
    contexte.restore();
  }

  function annulerTexte() {
    setTexte("");
    setTexteEdition(false);
  }

  function validerTexte() {
    const contenu = texte.trim();
    const canvas = canvasRef.current;

    if (!contenu || !canvas) {
      annulerTexte();
      return;
    }

    const contexte = canvas.getContext("2d");
    const position = positionTexteCanvasRef.current;
    const taillePolice = tailleTexte;

    contexte.save();
    contexte.globalCompositeOperation =
      "source-over";
    contexte.globalAlpha = 1;
    contexte.fillStyle = couleur;
    const style = [
      texteItalique ? "italic" : "",
      texteGras ? "bold" : "",
    ]
      .filter(Boolean)
      .join(" ");

    contexte.font =
      `${style} ${taillePolice}px Arial`.trim();
    contexte.textBaseline = "top";
    contexte.fillText(
      contenu,
      position.x,
      position.y
    );
    contexte.restore();

    setTexte("");
    setTexteEdition(false);
    enregistrerEtat();
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

    if (!canvas) {
      return;
    }

    const contexte =
      canvas.getContext("2d");

    const position =
      obtenirPosition(event);

    if (outil === "texte") {
      const rectangle =
        canvas.getBoundingClientRect();

      positionTexteCanvasRef.current =
        position;

      setPositionTexte({
        x: event.clientX - rectangle.left,
        y: event.clientY - rectangle.top,
      });

      setTexte("");
      setTexteEdition(true);
      return;
    }

    try {
      canvas.setPointerCapture(
        event.pointerId
      );
    } catch {
      // Le pointeur est peut-être déjà capturé.
    }

    if (outil === "ligne") {
      pointDepartLigneRef.current =
        position;

      imageAvantLigneRef.current =
        contexte.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

      dessineRef.current = true;
      setDessine(true);
      return;
    }

    if (outil === "fleche") {
      pointDepartFlecheRef.current =
        position;

      imageAvantFlecheRef.current =
        contexte.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

      dessineRef.current = true;
      setDessine(true);
      return;
    }

    if (outil === "rectangle") {
      pointDepartRectangleRef.current =
        position;

      imageAvantRectangleRef.current =
        contexte.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

      dessineRef.current = true;
      setDessine(true);
      return;
    }

    if (outil === "cercle") {
      centreCercleRef.current =
        position;

      imageAvantCercleRef.current =
        contexte.getImageData(
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

    contexte.moveTo(
      position.x,
      position.y
    );

    dessineRef.current = true;
    setDessine(true);
  }

  function dessiner(event) {
    if (!dessineRef.current) {
      return;
    }

    event.preventDefault();

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const contexte =
      canvas.getContext("2d");

    const position =
      obtenirPosition(event);

    if (outil === "ligne") {
      tracerApercuLigne(position);
      return;
    }

    if (outil === "fleche") {
      tracerApercuFleche(position);
      return;
    }

    if (outil === "rectangle") {
      tracerApercuRectangle(
        position,
        event.shiftKey
      );

      return;
    }

    if (outil === "cercle") {
      tracerApercuCercle(position);
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
      contexte.lineWidth =
        epaisseur * 5;
    } else {
      contexte.globalCompositeOperation =
        "source-over";

      contexte.strokeStyle = couleur;

      contexte.lineWidth = Math.max(
        1,
        epaisseur * pression * 2
      );
    }

    contexte.lineTo(
      position.x,
      position.y
    );

    contexte.stroke();
    contexte.restore();

    contexte.beginPath();

    contexte.moveTo(
      position.x,
      position.y
    );
  }

  function terminerDessin(event) {
    if (!dessineRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const contexte =
      canvas.getContext("2d");

    if (outil === "ligne") {
      if (
        event?.type ===
        "pointercancel"
      ) {
        if (
          imageAvantLigneRef.current
        ) {
          contexte.putImageData(
            imageAvantLigneRef.current,
            0,
            0
          );
        }
      } else if (event) {
        tracerApercuLigne(
          obtenirPosition(event)
        );
      }

      pointDepartLigneRef.current =
        null;

      imageAvantLigneRef.current =
        null;
    } else if (outil === "fleche") {
      if (
        event?.type ===
        "pointercancel"
      ) {
        if (
          imageAvantFlecheRef.current
        ) {
          contexte.putImageData(
            imageAvantFlecheRef.current,
            0,
            0
          );
        }
      } else if (event) {
        tracerApercuFleche(
          obtenirPosition(event)
        );
      }

      pointDepartFlecheRef.current =
        null;

      imageAvantFlecheRef.current =
        null;
    } else if (
      outil === "rectangle"
    ) {
      if (
        event?.type ===
        "pointercancel"
      ) {
        if (
          imageAvantRectangleRef.current
        ) {
          contexte.putImageData(
            imageAvantRectangleRef.current,
            0,
            0
          );
        }
      } else if (event) {
        tracerApercuRectangle(
          obtenirPosition(event),
          event.shiftKey
        );
      }

      pointDepartRectangleRef.current =
        null;

      imageAvantRectangleRef.current =
        null;
    } else if (outil === "cercle") {
      if (
        event?.type ===
        "pointercancel"
      ) {
        if (
          imageAvantCercleRef.current
        ) {
          contexte.putImageData(
            imageAvantCercleRef.current,
            0,
            0
          );
        }
      } else if (event) {
        tracerApercuCercle(
          obtenirPosition(event)
        );
      }

      centreCercleRef.current = null;
      imageAvantCercleRef.current =
        null;
    } else {
      contexte.closePath();
    }

    if (
      event?.pointerId !== undefined
    ) {
      try {
        canvas.releasePointerCapture(
          event.pointerId
        );
      } catch {
        // Le pointeur est peut-être déjà libéré.
      }
    }

    dessineRef.current = false;
    setDessine(false);

    if (
      event?.type !== "pointercancel"
    ) {
      enregistrerEtat();
    }
  }

  function effacerTout() {
    const confirmation =
      window.confirm(
        "Voulez-vous vraiment effacer tout le tableau ?"
      );

    if (!confirmation) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const contexte =
      canvas.getContext("2d");

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

    const canvasFond =
      canvasFondRef.current;

    if (!canvas || !canvasFond) {
      return;
    }

    const canvasFinal =
      document.createElement("canvas");

    canvasFinal.width = canvas.width;
    canvasFinal.height = canvas.height;

    const contexteFinal =
      canvasFinal.getContext("2d");

    contexteFinal.drawImage(
      canvasFond,
      0,
      0
    );

    contexteFinal.drawImage(
      canvas,
      0,
      0
    );

    const lien =
      document.createElement("a");

    lien.download =
      `tableau-${Date.now()}.png`;

    lien.href =
      canvasFinal.toDataURL(
        "image/png"
      );

    lien.click();
  }

  function retournerAccueil() {
    window.location.href =
      window.location.pathname;
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
      <div
        style={{
          marginBottom: "14px",
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
          telechargerImage={
            telechargerImage
          }
          retournerAccueil={
            retournerAccueil
          }
         texteGras={texteGras}
setTexteGras={setTexteGras}
texteItalique={texteItalique}
setTexteItalique={setTexteItalique}
tailleTexte={tailleTexte}
setTailleTexte={setTailleTexte}
        />
      </div>

      
      <CanvasBoard
  containerRef={containerRef}
  canvasFondRef={canvasFondRef}
  canvasRef={canvasRef}
  outil={outil}
  dessine={dessine}
  commencerDessin={commencerDessin}
  dessiner={dessiner}
  terminerDessin={terminerDessin}
  texteEdition={texteEdition}
  texte={texte}
  setTexte={setTexte}
  positionTexte={positionTexte}
  inputTexteRef={inputTexteRef}
  validerTexte={validerTexte}
  annulerTexte={annulerTexte}
 couleur={couleur}
epaisseur={epaisseur}
tailleTexte={tailleTexte}
texteGras={texteGras}
texteItalique={texteItalique}
/>
     
    </div>
  );
}