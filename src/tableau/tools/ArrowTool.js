export default function dessinerFleche(
  contexte,
  pointDepart,
  pointArrivee,
  couleur = "#000000",
  epaisseur = 4
) {
  if (
    !contexte ||
    !pointDepart ||
    !pointArrivee
  ) {
    return;
  }

  const angle = Math.atan2(
    pointArrivee.y - pointDepart.y,
    pointArrivee.x - pointDepart.x
  );

  const longueurFleche = Math.max(
    12,
    epaisseur * 4
  );

  contexte.save();

  contexte.globalCompositeOperation =
    "source-over";

  contexte.globalAlpha = 1;
  contexte.strokeStyle = couleur;
  contexte.fillStyle = couleur;
  contexte.lineWidth = epaisseur;
  contexte.lineCap = "round";
  contexte.lineJoin = "round";

  // Ligne principale
  contexte.beginPath();

  contexte.moveTo(
    pointDepart.x,
    pointDepart.y
  );

  contexte.lineTo(
    pointArrivee.x,
    pointArrivee.y
  );

  contexte.stroke();

  // Pointe de la flèche
  contexte.beginPath();

  contexte.moveTo(
    pointArrivee.x,
    pointArrivee.y
  );

  contexte.lineTo(
    pointArrivee.x -
      longueurFleche *
        Math.cos(angle - Math.PI / 6),

    pointArrivee.y -
      longueurFleche *
        Math.sin(angle - Math.PI / 6)
  );

  contexte.lineTo(
    pointArrivee.x -
      longueurFleche *
        Math.cos(angle + Math.PI / 6),

    pointArrivee.y -
      longueurFleche *
        Math.sin(angle + Math.PI / 6)
  );

  contexte.closePath();
  contexte.fill();

  contexte.restore();
}