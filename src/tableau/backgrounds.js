export function dessinerFond(ctx, largeur, hauteur, fond) {
  ctx.clearRect(0, 0, largeur, hauteur);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, largeur, hauteur);

  switch (fond) {
    case "petits":
      dessinerQuadrillage(ctx, largeur, hauteur, 20, "#e5e7eb");
      break;

    case "grands":
      dessinerQuadrillage(ctx, largeur, hauteur, 40, "#d1d5db");
      break;

    case "millimetre":
      dessinerQuadrillage(ctx, largeur, hauteur, 10, "#eef2f7");
      dessinerQuadrillage(ctx, largeur, hauteur, 50, "#cbd5e1");
      break;

    case "repere":
      dessinerRepere(ctx, largeur, hauteur);
      break;

    default:
      break;
  }
}

function dessinerQuadrillage(
  ctx,
  largeur,
  hauteur,
  pas,
  couleur
) {
  ctx.save();

  ctx.strokeStyle = couleur;
  ctx.lineWidth = 1;

  for (let x = 0; x <= largeur; x += pas) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, hauteur);
    ctx.stroke();
  }

  for (let y = 0; y <= hauteur; y += pas) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(largeur, y);
    ctx.stroke();
  }

  ctx.restore();
}

function dessinerRepere(
  ctx,
  largeur,
  hauteur
) {
  dessinerQuadrillage(
    ctx,
    largeur,
    hauteur,
    40,
    "#e5e7eb"
  );

  const cx = largeur / 2;
  const cy = hauteur / 2;

  ctx.save();

  ctx.strokeStyle = "#555";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(largeur, cy);

  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, hauteur);

  ctx.stroke();

  ctx.restore();
}