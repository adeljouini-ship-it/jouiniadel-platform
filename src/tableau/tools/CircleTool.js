export default class CircleTool {
  constructor(ctx) {
    this.ctx = ctx;
  }

  draw(start, end, couleur, epaisseur) {
    this.ctx.save();

    this.ctx.strokeStyle = couleur;
    this.ctx.lineWidth = epaisseur;

    const radius = Math.sqrt(
      Math.pow(end.x - start.x, 2) +
      Math.pow(end.y - start.y, 2)
    );

    this.ctx.beginPath();
    this.ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.restore();
  }

  preview(start, end, couleur, epaisseur) {
    this.draw(start, end, couleur, epaisseur);
  }
}